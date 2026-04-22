import pandas as pd

def add_indicators(df):
    # Moving Average
    df['MA20'] = df['Close'].rolling(window=20).mean()

    # RSI Calculation
    delta = df['Close'].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()

    rs = avg_gain / avg_loss
    df['RSI'] = 100 - (100 / (1 + rs))

    return df
