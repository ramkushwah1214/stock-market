def rsi_signal(rsi):
    if rsi < 30:
        return "BUY", "RSI is below 30, which indicates oversold conditions."
    if rsi > 70:
        return "SELL", "RSI is above 70, which indicates overbought conditions."
    return "HOLD", "RSI is neutral."


def build_decision(rsi, trend, sentiment):
    score = 0
    reasons = []

    signal, rsi_reason = rsi_signal(rsi)
    reasons.append(rsi_reason)
    if signal == "BUY":
        score += 1
    elif signal == "SELL":
        score -= 1

    if trend == "UP":
        score += 1
        reasons.append("The LSTM model predicts upward short-term price movement.")
    else:
        score -= 1
        reasons.append("The LSTM model predicts downward short-term price movement.")

    if sentiment == "Positive":
        score += 1
        reasons.append("Recent news sentiment is positive.")
    elif sentiment == "Negative":
        score -= 1
        reasons.append("Recent news sentiment is negative.")
    else:
        reasons.append("Recent news sentiment is neutral.")

    if score >= 2:
        return "BUY", 82, "Medium Risk", " ".join(reasons)
    if score <= -2:
        return "SELL", 80, "High Risk", " ".join(reasons)
    return "HOLD", 65, "Medium Risk", " ".join(reasons)
