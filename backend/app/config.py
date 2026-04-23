import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
CACHE_DIR = BASE_DIR / ".cache"
CACHE_DIR.mkdir(exist_ok=True)
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
load_dotenv(BASE_DIR / ".env")


class Config:
    JSON_SORT_KEYS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
    YFINANCE_TIMEOUT = int(os.getenv("YFINANCE_TIMEOUT", "8"))
    DEFAULT_MARKET_SUFFIX = ".NS"
    LSTM_WINDOW = int(os.getenv("LSTM_WINDOW", "10"))
    LSTM_EPOCHS = int(os.getenv("LSTM_EPOCHS", "3"))
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"
