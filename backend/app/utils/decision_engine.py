# decision_engine.py

def get_decision_details(rsi):
    if rsi < 30:
        return "BUY", "RSI is below 30 (Oversold condition)"
    elif rsi > 70:
        return "SELL", "RSI is above 70 (Overbought condition)"
    else:
        return "HOLD", "RSI is between 30 and 70 (Neutral market)"


def get_confidence(rsi):
    if rsi < 30:
        return min(90, int(70 + (30 - rsi)))
    elif rsi > 70:
        return min(90, int(70 + (rsi - 70)))
    else:
        return 60


def get_risk_level(rsi):
    if rsi < 35 or rsi > 65:
        return "Low Risk"
    elif 35 <= rsi <= 45 or 55 <= rsi <= 65:
        return "Medium Risk"
    else:
        return "High Risk"


def final_decision_engine(rsi_decision, lstm_trend, sentiment):
    score = 0
    reasons = []

    if rsi_decision == "BUY":
        score += 1
        reasons.append("RSI indicates oversold condition")
    elif rsi_decision == "SELL":
        score -= 1
        reasons.append("RSI indicates overbought condition")
    else:
        reasons.append("RSI indicates neutral market")

    if lstm_trend == "UP":
        score += 1
        reasons.append("LSTM predicts upward price trend")
    else:
        score -= 1
        reasons.append("LSTM predicts downward price trend")

    if sentiment == "Positive":
        score += 1
        reasons.append("News sentiment is positive")
    elif sentiment == "Negative":
        score -= 1
        reasons.append("News sentiment is negative")
    else:
        reasons.append("News sentiment is neutral")

    if score >= 2:
        return "BUY", "; ".join(reasons), "High", "Low Risk"
    elif score <= -2:
        return "SELL", "; ".join(reasons), "High", "Low Risk"
    else:
        return "HOLD", "; ".join(reasons), "Medium", "Medium Risk"
