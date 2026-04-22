import pandas as pd


def add_indicators(df, ma_window=20, rsi_window=14):
    """Add RSI and moving average columns to OHLCV data."""
    if df.empty:
        return df

    data = df.copy()
    data["MA20"] = data["Close"].rolling(window=ma_window, min_periods=1).mean()

    delta = data["Close"].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(window=rsi_window, min_periods=rsi_window).mean()
    avg_loss = loss.rolling(window=rsi_window, min_periods=rsi_window).mean()
    rs = avg_gain / avg_loss.replace(0, pd.NA)
    data["RSI"] = 100 - (100 / (1 + rs))
    data["RSI"] = data["RSI"].fillna(50)

    return data
