import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
CACHE_DIR = BASE_DIR / ".cache"
CACHE_DIR.mkdir(exist_ok=True)
load_dotenv(BASE_DIR / ".env")


class Config:
    JSON_SORT_KEYS = False
    NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
    YFINANCE_TIMEOUT = int(os.getenv("YFINANCE_TIMEOUT", "8"))
    DEFAULT_MARKET_SUFFIX = ".NS"
    LSTM_WINDOW = int(os.getenv("LSTM_WINDOW", "10"))
    LSTM_EPOCHS = int(os.getenv("LSTM_EPOCHS", "3"))
