from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


analyzer = SentimentIntensityAnalyzer()


def _news_text(news):
    if isinstance(news, dict):
        return news.get("title") or news.get("description") or ""
    return str(news)


def analyze_multiple_news(news_list):
    scores = []

    for news in news_list:
        score = analyzer.polarity_scores(_news_text(news))["compound"]
        scores.append(score)

    avg_score = sum(scores) / len(scores) if scores else 0

    if avg_score >= 0.05:
        return "Positive"
    if avg_score <= -0.05:
        return "Negative"
    return "Neutral"
