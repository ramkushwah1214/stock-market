CONCEPTS = {
    "rsi": (
        "RSI means Relative Strength Index. It ranges from 0 to 100. "
        "Below 30 often suggests oversold conditions, while above 70 often "
        "suggests overbought conditions. It should be used with trend and volume."
    ),
    "moving average": (
        "A moving average smooths price data. A 20-day moving average helps show "
        "short-term direction and can act as dynamic support or resistance."
    ),
    "lstm": (
        "LSTM is a neural network model useful for sequential data. In this app it "
        "looks at recent closing prices and estimates whether the next move is UP or DOWN."
    ),
    "sentiment": (
        "Sentiment analysis reads financial headlines and classifies them as Positive, "
        "Negative, or Neutral. It is useful context, but not a standalone signal."
    ),
    "risk": (
        "Risk depends on volatility, trend strength, valuation, and news flow. "
        "Diversification and position sizing are more important than a single signal."
    ),
}


def answer(message):
    text = (message or "").strip()
    lowered = text.lower()

    if not text:
        return "Ask me about RSI, moving averages, LSTM trend, sentiment, or a stock symbol."

    for keyword, response in CONCEPTS.items():
        if keyword in lowered:
            return response

    if any(word in lowered for word in ["buy", "sell", "should i", "recommend"]):
        return (
            "I can explain signals and risk factors, but I cannot give direct financial advice. "
            "Use the analysis endpoint to review price trend, RSI, moving average, and news sentiment, "
            "then make a decision based on your own risk profile."
        )

    if any(word in lowered for word in ["stock", "market", "trend", "price"]):
        return (
            "A balanced stock review should check price trend, RSI, moving averages, volume, "
            "recent news sentiment, and broader sector movement. No single indicator is enough."
        )

    return (
        "I am your stock-market assistant. I can explain indicators, trend signals, "
        "sentiment, and risk in simple language. I avoid direct financial advice."
    )
