import math

from werkzeug.exceptions import BadRequest, NotFound

from app.services.market_service import _number
from app.services.symbol_service import display_symbol, resolve_symbol
from app.services.yfinance_client import yf


DEFAULT_HISTORY_PERIOD = "1mo"
DEFAULT_HISTORY_INTERVAL = "1d"
ALLOWED_HISTORY_PERIODS = {
    "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max",
}
ALLOWED_HISTORY_INTERVALS = {
    "1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo",
}


def get_quote(symbol):
    resolved = resolve_symbol(symbol)
    ticker = yf.Ticker(resolved)

    try:
        history = ticker.history(period="5d", interval="1d")
    except Exception as exc:
        raise NotFound(f"Could not load quote data for {symbol}") from exc

    if history.empty:
        raise NotFound(f"No quote data found for {symbol}")

    info = _safe_info(ticker)
    latest = history.iloc[-1]
    previous = history.iloc[-2] if len(history) > 1 else latest
    price = float(latest.get("Close") or 0)
    previous_close = float(previous.get("Close") or 0)
    change = price - previous_close
    change_percent = (change / previous_close) * 100 if previous_close else 0

    return {
        "symbol": display_symbol(resolved),
        "resolvedSymbol": resolved,
        "name": info.get("longName") or info.get("shortName") or display_symbol(resolved),
        "exchange": info.get("exchange"),
        "currency": info.get("currency"),
        "price": round(price, 2),
        "change": round(change, 2),
        "changePercent": round(change_percent, 2),
        "open": _number(latest.get("Open")),
        "high": _number(latest.get("High")),
        "low": _number(latest.get("Low")),
        "volume": int(latest.get("Volume", 0) or 0),
        "previousClose": round(previous_close, 2),
        "marketCap": info.get("marketCap"),
        "trailingPE": info.get("trailingPE"),
        "dividendYield": info.get("dividendYield"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
    }


def get_history(symbol, period=DEFAULT_HISTORY_PERIOD, interval=DEFAULT_HISTORY_INTERVAL):
    resolved = resolve_symbol(symbol)
    normalized_period = (period or DEFAULT_HISTORY_PERIOD).strip()
    normalized_interval = (interval or DEFAULT_HISTORY_INTERVAL).strip()

    if normalized_period not in ALLOWED_HISTORY_PERIODS:
        raise BadRequest(
            f"Unsupported period '{normalized_period}'. Use one of: {', '.join(sorted(ALLOWED_HISTORY_PERIODS))}"
        )
    if normalized_interval not in ALLOWED_HISTORY_INTERVALS:
        raise BadRequest(
            f"Unsupported interval '{normalized_interval}'. Use one of: {', '.join(sorted(ALLOWED_HISTORY_INTERVALS))}"
        )

    ticker = yf.Ticker(resolved)
    try:
        history = ticker.history(period=normalized_period, interval=normalized_interval)
    except Exception as exc:
        raise NotFound(f"Could not load history data for {symbol}") from exc

    if history.empty:
        raise NotFound(f"No history data found for {symbol}")

    items = []
    for _, row in history.reset_index().iterrows():
        timestamp = row.get("Datetime", row.get("Date"))
        items.append({
            "timestamp": timestamp.isoformat() if timestamp is not None else None,
            "open": _number(row.get("Open")),
            "high": _number(row.get("High")),
            "low": _number(row.get("Low")),
            "close": _number(row.get("Close")),
            "volume": int(row.get("Volume", 0) or 0),
        })

    return {
        "symbol": display_symbol(resolved),
        "resolvedSymbol": resolved,
        "period": normalized_period,
        "interval": normalized_interval,
        "items": items,
    }


def get_info(symbol):
    resolved = resolve_symbol(symbol)
    ticker = yf.Ticker(resolved)
    info = _safe_info(ticker)

    if not info:
        raise NotFound(f"No company info found for {symbol}")

    keys = [
        "longName",
        "shortName",
        "symbol",
        "exchange",
        "quoteType",
        "currency",
        "sector",
        "industry",
        "website",
        "longBusinessSummary",
        "marketCap",
        "fullTimeEmployees",
        "country",
        "city",
        "state",
        "trailingPE",
        "trailingEps",
        "forwardPE",
        "dividendYield",
        "fiftyTwoWeekHigh",
        "fiftyTwoWeekLow",
    ]

    payload = {"symbol": display_symbol(resolved), "resolvedSymbol": resolved}
    for key in keys:
        payload[key] = _clean_value(info.get(key))
    return payload


def search_symbols(query, limit=10):
    text = (query or "").strip()
    if not text:
        raise BadRequest("Search query is required")

    try:
        search = yf.Search(text, max_results=limit)
        quotes = getattr(search, "quotes", []) or []
    except Exception as exc:
        raise NotFound(f"Could not search Yahoo Finance for '{text}'") from exc

    results = []
    for item in quotes[:limit]:
        results.append({
            "symbol": item.get("symbol"),
            "name": item.get("shortname") or item.get("longname"),
            "exchange": item.get("exchange"),
            "type": item.get("quoteType"),
        })

    return {"query": text, "results": results}


def _safe_info(ticker):
    try:
        return ticker.info or {}
    except Exception:
        return {}


def _clean_value(value):
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    return value
