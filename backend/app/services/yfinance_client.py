import yfinance as yf

from app.config import CACHE_DIR


YFINANCE_CACHE_DIR = CACHE_DIR / "yfinance"
YFINANCE_CACHE_DIR.mkdir(parents=True, exist_ok=True)

if hasattr(yf, "set_tz_cache_location"):
    yf.set_tz_cache_location(str(YFINANCE_CACHE_DIR))
