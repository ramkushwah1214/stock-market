import numpy as np


def predict_trend(close_prices):
    """Estimate short-term direction from recent price momentum."""
    close_prices = np.asarray(close_prices, dtype=float)
    close_prices = close_prices[np.isfinite(close_prices)]

    if len(close_prices) < 2:
        return "DOWN"

    recent = close_prices[-20:]
    short_window = recent[-5:] if len(recent) >= 5 else recent
    long_window = recent

    short_mean = float(np.mean(short_window))
    long_mean = float(np.mean(long_window))
    latest = float(recent[-1])

    if latest >= short_mean >= long_mean:
        return "UP"
    if latest >= long_mean and latest >= recent[0]:
        return "UP"
    return "DOWN"
