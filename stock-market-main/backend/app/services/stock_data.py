import math

import yfinance as yf
from werkzeug.exceptions import BadRequest, NotFound

from app.models.lstm_model import predict_trend
from app.services.decision_service import build_decision
from app.services.indicator_service import add_indicators
from app.services.news_service_v2 import fetch_news
from app.services.sentiment_service import analyze_articles
from app.services.symbol_service import company_query, display_symbol, resolve_symbol


def get_price_history(symbol, period="1y", interval="1d"):
    resolved = resolve_symbol(symbol)
    try:
        history = yf.Ticker(resolved).history(period=period, interval=interval)
    except Exception as exc:
        raise NotFound(f"Could not load market data for {symbol}") from exc

    if history.empty:
        raise NotFound(f"No market data found for {symbol}")
    return resolved, history


def analyze_stock(symbol):
    resolved, history = get_price_history(symbol, period="1y", interval="1d")
    history = add_indicators(history)

    latest = history.iloc[-1]
    previous = history.iloc[-2] if len(history) > 1 else latest
    price = float(latest["Close"])
    previous_close = float(previous["Close"])

    if any(math.isnan(value) for value in (price, previous_close)):
        raise NotFound(f"Incomplete market data found for {symbol}")

    change = price - previous_close
    percent = (change / previous_close) * 100 if previous_close else 0

    trend = predict_trend(history["Close"].values)
    news = fetch_news(company_query(resolved), page_size=5)
    sentiment = analyze_articles(news)

    rsi = float(latest["RSI"])
    moving_average = float(latest["MA20"])
    if any(math.isnan(value) for value in (rsi, moving_average)):
        raise NotFound(f"Incomplete indicator data found for {symbol}")

    recommendation, confidence, risk, explanation = build_decision(
        rsi,
        trend,
        sentiment,
    )

    return {
        "stock": display_symbol(resolved),
        "resolvedSymbol": resolved,
        "price": round(price, 2),
        "change": round(change, 2),
        "percent": round(percent, 2),
        "trend": trend,
        "sentiment": sentiment,
        "recommendation": recommendation,
        "confidence": confidence,
        "risk": risk,
        "explanation": explanation,
        "news": news[:5],
        "indicators": {
            "RSI": round(rsi, 2),
            "movingAverage": round(moving_average, 2),
            "MA20": round(moving_average, 2),
        },
    }
