from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


analyzer = SentimentIntensityAnalyzer()


def score_text(text):
    if not text:
        return 0
    return analyzer.polarity_scores(text)["compound"]


def label_from_score(score):
    if score >= 0.05:
        return "Positive"
    if score <= -0.05:
        return "Negative"
    return "Neutral"


def analyze_articles(articles):
    if not articles:
        return "Neutral"

    scores = [
        score_text(f"{article.get('title', '')}. {article.get('description', '')}")
        for article in articles
    ]
    average = sum(scores) / len(scores)
    return label_from_score(average)
