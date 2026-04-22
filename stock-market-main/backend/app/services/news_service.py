import os

import requests


API_KEY = os.getenv("NEWS_API_KEY", "")


def get_live_news(company):
    if not API_KEY:
        return []

    params = {
        "q": f"{company} stock",
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 5,
        "apiKey": API_KEY,
    }

    try:
        response = requests.get(
            "https://newsapi.org/v2/everything",
            params=params,
            timeout=5,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException:
        return []

    articles = []
    if data.get("status") == "ok":
        for article in data.get("articles", []):
            articles.append({
                "title": article.get("title", ""),
                "link": article.get("url", ""),
                "source": article.get("source", {}).get("name", ""),
                "sentiment": "Neutral",
            })

    return articles
