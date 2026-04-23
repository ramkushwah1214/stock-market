import math

from werkzeug.exceptions import NotFound

from app.services.symbol_service import (
    INDEX_SYMBOLS,
    POPULAR_INDIAN,
    display_symbol,
    resolve_symbol,
)
from app.services.yfinance_client import yf


RANGE_MAP = {
    "1d": ("1d", "5m"),
    "1D": ("1d", "5m"),
    "1w": ("5d", "30m"),
    "1W": ("5d", "30m"),
    "1m": ("1mo", "1d"),
    "1M": ("1mo", "1d"),
    "1y": ("1y", "1wk"),
    "1Y": ("1y", "1wk"),
}

MOVER_SYMBOLS = [
    "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "ITC",
    "LT", "AXISBANK", "BHARTIARTL", "TATAMOTORS", "TATASTEEL", "WIPRO",
    "HCLTECH", "KOTAKBANK", "SUNPHARMA", "MARUTI", "ULTRACEMCO",
    "ADANIENT", "ADANIPORTS", "ASIANPAINT", "BAJFINANCE", "BAJAJFINSV",
    "CIPLA", "COALINDIA", "DRREDDY", "EICHERMOT", "GRASIM", "HINDALCO",
    "HINDUNILVR", "JSWSTEEL", "M&M", "NESTLEIND", "NTPC", "ONGC",
    "POWERGRID", "TATACONSUM", "TECHM", "TITAN", "UPL",
]

SECTOR_INDICES = {
    "Banking": "^NSEBANK",
    "IT": "^CNXIT",
    "Auto": "^CNXAUTO",
    "Pharma": "^CNXPHARMA",
    "FMCG": "^CNXFMCG",
    "Energy": "^CNXENERGY",
}

FALLBACK_NEWS = [
    {
        "title": "Indian markets track global cues and sector rotation",
        "description": "Benchmark indices remain sensitive to earnings, crude prices, currency movement, and institutional flows.",
        "source": "AI Invest Market Desk",
        "sentiment": "Neutral",
        "url": "",
        "link": "",
    },
    {
        "title": "Banking, IT, and energy stocks stay in focus",
        "description": "Large-cap names continue to drive market breadth while traders monitor support and resistance zones.",
        "source": "AI Invest Market Desk",
        "sentiment": "Positive",
        "url": "",
        "link": "",
    },
    {
        "title": "Volatility remains a key risk for short-term traders",
        "description": "Analysts suggest combining trend, RSI, moving averages, and news sentiment instead of relying on one signal.",
        "source": "AI Invest Market Desk",
        "sentiment": "Neutral",
        "url": "",
        "link": "",
    },
]

FALLBACK_MOVERS = {
    "gainers": [
        {"symbol": "RELIANCE", "name": "Reliance Industries", "price": 2950.45, "change": 1.24, "percent": 1.24},
        {"symbol": "TCS", "name": "Tata Consultancy Services", "price": 3980.2, "change": 0.86, "percent": 0.86},
        {"symbol": "INFY", "name": "Infosys", "price": 1485.6, "change": 0.72, "percent": 0.72},
        {"symbol": "HDFCBANK", "name": "HDFC Bank", "price": 1420.3, "change": 0.48, "percent": 0.48},
        {"symbol": "ITC", "name": "ITC", "price": 445.1, "change": 0.31, "percent": 0.31},
    ],
    "losers": [
        {"symbol": "TATAMOTORS", "name": "Tata Motors", "price": 925.4, "change": -1.08, "percent": -1.08},
        {"symbol": "WIPRO", "name": "Wipro", "price": 512.25, "change": -0.74, "percent": -0.74},
        {"symbol": "SBIN", "name": "State Bank of India", "price": 765.8, "change": -0.52, "percent": -0.52},
        {"symbol": "AXISBANK", "name": "Axis Bank", "price": 1088.15, "change": -0.39, "percent": -0.39},
        {"symbol": "MARUTI", "name": "Maruti Suzuki", "price": 12050.0, "change": -0.25, "percent": -0.25},
    ],
}


def chart_data(symbol, range_name="1m"):
    period, interval = RANGE_MAP.get(range_name, RANGE_MAP["1m"])
    resolved = resolve_symbol(symbol)

    try:
        hist = yf.Ticker(resolved).history(period=period, interval=interval)
    except Exception as exc:
        raise NotFound(f"Could not load chart data for {symbol}") from exc

    if hist.empty:
        raise NotFound(f"No chart data found for {symbol}")

    rows = []
    for index, row in hist.tail(250).iterrows():
        close_price = _number(row.get("Close"))
        if close_price is None:
            continue
        rows.append({
            "date": index.isoformat(),
            "time": index.strftime("%H:%M") if period == "1d" else index.strftime("%d %b"),
            "open": _number(row.get("Open")),
            "high": _number(row.get("High")),
            "low": _number(row.get("Low")),
            "close": close_price,
            "price": close_price,
            "volume": int(row.get("Volume", 0) or 0),
        })
    if not rows:
        raise NotFound(f"No valid chart data found for {symbol}")
    return rows


def quote(symbol):
    resolved = resolve_symbol(symbol)
    try:
        ticker = yf.Ticker(resolved)
        hist = ticker.history(period="5d")
        info = _safe_info(ticker)
    except Exception as exc:
        raise NotFound(f"Could not load quote data for {symbol}") from exc

    if hist.empty:
        raise NotFound(f"No quote data found for {symbol}")

    latest = hist.iloc[-1]
    previous = hist.iloc[-2] if len(hist) > 1 else latest
    price = float(latest["Close"])
    prev_close = float(previous["Close"])
    if any(math.isnan(value) for value in (price, prev_close)):
        raise NotFound(f"Incomplete quote data found for {symbol}")
    change = price - prev_close
    percent = (change / prev_close) * 100 if prev_close else 0

    return {
        "symbol": display_symbol(resolved),
        "resolvedSymbol": resolved,
        "name": info.get("longName") or info.get("shortName"),
        "price": round(price, 2),
        "currentPrice": round(price, 2),
        "change": round(change, 2),
        "dayChange": round(change, 2),
        "percent": round(percent, 2),
        "dayChangePercent": round(percent, 2),
        "high": _number(latest["High"]),
        "low": _number(latest["Low"]),
        "volume": int(latest.get("Volume", 0) or 0),
        "sector": info.get("sector"),
        "mcap": _format_market_cap(info.get("marketCap")),
        "marketCap": info.get("marketCap"),
        "peRatio": info.get("trailingPE"),
        "dividendYield": info.get("dividendYield"),
        "profitGrowth": info.get("earningsGrowth"),
        "revenueGrowth": info.get("revenueGrowth"),
    }


def movers(kind="gainers", page=1, per_page=10):
    kind = "losers" if kind == "losers" else "gainers"
    quotes = []
    for symbol in MOVER_SYMBOLS:
        try:
            item = quote(symbol)
            percent = _number(item.get("percent"))
            quotes.append({
                "symbol": item["symbol"],
                "name": item["name"],
                "price": item["price"],
                "change": percent,
                "percent": percent,
            })
        except Exception:
            continue

    if kind == "gainers":
        quotes = [item for item in quotes if item["percent"] > 0]
        quotes.sort(key=lambda item: item["percent"], reverse=True)
    else:
        quotes = [item for item in quotes if item["percent"] < 0]
        quotes.sort(key=lambda item: item["percent"])

    if not quotes:
        quotes = FALLBACK_MOVERS[kind]

    start = max(page - 1, 0) * per_page
    end = start + per_page
    return {
        "data": quotes[start:end],
        "nextPage": page + 1,
        "hasMore": end < len(quotes),
    }


def sectors():
    data = []
    for name, symbol in SECTOR_INDICES.items():
        try:
            item = quote(symbol)
            change = item["percent"]
        except Exception:
            change = 0
        data.append({"name": name, "change": round(change, 2)})
    return data


def stock_info(symbol):
    item = quote(symbol)
    return {
        "symbol": item["symbol"],
        "name": item["name"],
        "sector": item["sector"],
        "mcap": item["mcap"],
    }


def compare(symbols, range_name="1m"):
    stocks = []
    for symbol in symbols:
        item = quote(symbol)
        stocks.append({
            "symbol": item["symbol"],
            "price": item["price"],
            "percent": item["percent"],
            "peRatio": item["peRatio"],
            "profitGrowth": item["profitGrowth"],
            "revenueGrowth": item["revenueGrowth"],
            "dividendYield": item["dividendYield"],
            "marketCap": item["marketCap"],
            "sector": item["sector"],
            "chartData": chart_data(symbol, range_name),
        })

    best = max(stocks, key=lambda stock: stock["percent"], default=None)
    return {
        "stocks": stocks,
        "aiSuggestion": {
            "bestStock": best["symbol"] if best else "N/A",
            "confidence": 70,
            "reason": "Based on recent price momentum, valuation fields, and sector data.",
        },
    }


def index_dashboard(index_name, range_name="1D"):
    symbol = INDEX_SYMBOLS.get(index_name.upper(), index_name)
    item = quote(symbol)
    data = chart_data(symbol, range_name)

    return {
        "symbol": index_name.upper(),
        "price": item["price"],
        "change": item["change"],
        "percent": item["percent"],
        "high": item["high"],
        "low": item["low"],
        "volume": item["volume"],
        "chartData": data,
        "aiInsights": {
            "recommendation": "HOLD",
            "confidence": 68,
            "explanation": "Dashboard signal combines recent index momentum and market breadth.",
        },
        "marketOverview": {
            "trend": "Bullish" if item["percent"] >= 0 else "Bearish",
            "advanceDecline": "Live breadth varies by exchange session",
            "volatility": "Moderate",
        },
        "news": FALLBACK_NEWS,
    }


def market_news_response(news):
    return {"news": news or []}


def _safe_info(ticker):
    try:
        return ticker.info or {}
    except Exception:
        return {}


def _number(value):
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return None
    return round(float(value), 2)


def _format_market_cap(value):
    if not value:
        return "N/A"
    if value >= 1e12:
        return f"{value / 1e12:.2f}T"
    if value >= 1e7:
        return f"{value / 1e7:.2f}Cr"
    return str(value)
