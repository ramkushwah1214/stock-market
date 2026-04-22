import requests
from flask import current_app

from app.services.sentiment_service import label_from_score, score_text


def fetch_news(query, page_size=5):
    """Fetch recent market news and attach VADER sentiment."""
    api_key = current_app.config.get("NEWS_API_KEY")
    if not api_key:
        return []

    articles = _fetch_from_newsapi(query, page_size, api_key)
    if articles:
        return articles

    articles = _fetch_from_finnhub(query, page_size, api_key)
    if articles:
        return articles

    return []


def _fetch_from_newsapi(query, page_size, api_key):
    params = {
        "q": f"{query} stock OR shares",
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": page_size,
        "apiKey": api_key,
    }

    try:
        response = requests.get(
            "https://newsapi.org/v2/everything",
            params=params,
            timeout=5,
        )
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException:
        return []

    articles = []
    for article in payload.get("articles", [])[:page_size]:
        text = f"{article.get('title', '')}. {article.get('description', '')}"
        articles.append({
            "title": article.get("title") or "",
            "description": article.get("description") or "",
            "source": (article.get("source") or {}).get("name") or "",
            "url": article.get("url") or "",
            "link": article.get("url") or "",
            "publishedAt": article.get("publishedAt") or "",
            "sentiment": label_from_score(score_text(text)),
        })

    return articles


def _fetch_from_finnhub(query, page_size, api_key):
    params = {
        "category": "general",
        "token": api_key,
    }

    try:
        response = requests.get(
            "https://finnhub.io/api/v1/news",
            params=params,
            timeout=5,
        )
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException:
        return []

    if not isinstance(payload, list):
        return []

    articles = []
    query_terms = _query_terms(query)

    for article in payload:
        title = article.get("headline") or ""
        description = article.get("summary") or ""
        source = article.get("source") or ""
        text = f"{title}. {description}"

        if query_terms and not _matches_terms(text, query_terms):
            continue

        articles.append({
            "title": title,
            "description": description,
            "source": source,
            "url": article.get("url") or "",
            "link": article.get("url") or "",
            "publishedAt": article.get("datetime") or "",
            "sentiment": label_from_score(score_text(text)),
        })

        if len(articles) >= page_size:
            break

    return articles


def _query_terms(query):
    ignored = {"stock", "stocks", "share", "shares", "market", "markets"}
    terms = {
        term.lower()
        for term in query.replace("-", " ").split()
        if len(term) > 2 and term.lower() not in ignored
    }
    terms.update({"india", "indian", "nifty", "sensex", "nse", "bse", "rupee", "dalal"})
    return terms


def _matches_terms(text, terms):
    lowered = text.lower()
    return any(term in lowered for term in terms)
