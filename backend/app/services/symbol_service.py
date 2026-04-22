from functools import lru_cache


POPULAR_INDIAN = {
    "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK",
    "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV", "BHARTIARTL", "BPCL",
    "BRITANNIA", "CIPLA", "COALINDIA", "DIVISLAB", "DRREDDY",
    "EICHERMOT", "GRASIM", "HCLTECH", "HDFCBANK", "HDFCLIFE",
    "HEROMOTOCO", "HINDALCO", "HINDUNILVR", "ICICIBANK", "INDUSINDBK",
    "INFY", "ITC", "JSWSTEEL", "KOTAKBANK", "LT", "M&M", "MARUTI",
    "NESTLEIND", "NTPC", "ONGC", "POWERGRID", "RELIANCE", "SBIN",
    "SUNPHARMA", "TATACONSUM", "TATAMOTORS", "TATASTEEL", "TCS",
    "TECHM", "TITAN", "ULTRACEMCO", "UPL", "WIPRO",
}

INDEX_SYMBOLS = {
    "NIFTY": "^NSEI",
    "NIFTY50": "^NSEI",
    "SENSEX": "^BSESN",
    "BANKNIFTY": "^NSEBANK",
    "BANK NIFTY": "^NSEBANK",
}


@lru_cache(maxsize=512)
def resolve_symbol(symbol):
    """Resolve user input into a Yahoo Finance ticker."""
    cleaned = symbol.strip().upper()
    if not cleaned:
        raise ValueError("Symbol is required")

    if cleaned in INDEX_SYMBOLS:
        return INDEX_SYMBOLS[cleaned]
    if cleaned.startswith("^") or "." in cleaned:
        return cleaned
    if cleaned in POPULAR_INDIAN:
        return f"{cleaned}.NS"

    # This project is India-only: plain user symbols are treated as NSE symbols.
    return f"{cleaned}.NS"


def display_symbol(symbol):
    return symbol.replace(".NS", "").replace("^", "")


def company_query(symbol):
    return display_symbol(symbol).replace("-", " ")
