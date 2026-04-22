import numpy as np
from flask import current_app
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.models import Sequential


def _prepare_sequences(close_prices, window):
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(close_prices.reshape(-1, 1))

    x_values, y_values = [], []
    for index in range(window, len(scaled)):
        x_values.append(scaled[index - window:index, 0])
        y_values.append(scaled[index, 0])

    x_values = np.array(x_values).reshape((-1, window, 1))
    y_values = np.array(y_values)
    return x_values, y_values, scaler


def predict_trend(close_prices):
    """
    Train a small LSTM on recent closing prices and return UP/DOWN.
    This is intentionally lightweight for API use.
    """
    close_prices = np.asarray(close_prices, dtype=float)
    window = current_app.config.get("LSTM_WINDOW", 10)

    if len(close_prices) < window + 5:
        return "UP" if close_prices[-1] >= close_prices[0] else "DOWN"

    try:
        close_prices = close_prices[-120:]
        x_values, y_values, scaler = _prepare_sequences(close_prices, window)

        model = Sequential([
            LSTM(32, input_shape=(window, 1)),
            Dense(1),
        ])
        model.compile(optimizer="adam", loss="mse")
        model.fit(
            x_values,
            y_values,
            epochs=current_app.config.get("LSTM_EPOCHS", 3),
            batch_size=16,
            verbose=0,
        )

        recent_scaled = scaler.transform(close_prices[-window:].reshape(-1, 1))
        model_input = recent_scaled.reshape((1, window, 1))
        prediction = model.predict(model_input, verbose=0)
        predicted_price = scaler.inverse_transform(prediction)[0][0]
        return "UP" if predicted_price >= close_prices[-1] else "DOWN"
    except Exception:
        recent = close_prices[-10:]
        return "UP" if recent[-1] >= recent.mean() else "DOWN"
