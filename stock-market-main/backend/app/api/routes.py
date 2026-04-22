from flask import Blueprint, jsonify, request

from app.services.chat_service import answer
from app.services.market_service import (
    chart_data,
    compare,
    index_dashboard,
    market_news_response,
    movers,
    quote,
    sectors,
    stock_info,
)
from app.services.news_service_v2 import fetch_news
from app.services.stock_data import analyze_stock
from app.services.yahoo_finance_service import (
    get_history,
    get_info,
    get_quote,
    search_symbols,
)


api = Blueprint("api", __name__)


@api.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Invest Flask backend is running",
        "endpoints": [
            "/analyze?symbol=TCS",
            "/chart?symbol=RELIANCE&range=1m",
            "/movers?type=gainers",
            "/sectors",
            "/chat",
        ],
    })


@api.route("/api/health", methods=["GET"])
@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@api.route("/analyze", methods=["GET"])
@api.route("/api/analyze", methods=["GET"])
def analyze():
    symbol = request.args.get("symbol", "").strip()
    if not symbol:
        return jsonify({"error": "Symbol query parameter is required"}), 400
    return jsonify(analyze_stock(symbol))


@api.route("/chart", methods=["GET"])
def chart():
    symbol = request.args.get("symbol", "").strip()
    range_name = request.args.get("range", "1m")
    if not symbol:
        return jsonify({"error": "Symbol query parameter is required"}), 400
    return jsonify(chart_data(symbol, range_name))


@api.route("/movers", methods=["GET"])
@api.route("/api/movers", methods=["GET"])
def top_movers():
    kind = request.args.get("type", "gainers")
    page = int(request.args.get("page", 1))
    result = movers(kind, page)
    if request.path == "/movers":
        return jsonify(result["data"])
    return jsonify(result)


@api.route("/sectors", methods=["GET"])
@api.route("/api/sectors", methods=["GET"])
def sector_performance():
    return jsonify(sectors())


@api.route("/chat", methods=["POST"])
@api.route("/api/chat", methods=["POST"])
def chat():
    payload = request.get_json(silent=True) or {}
    message = payload.get("message")

    if message is None and payload.get("messages"):
        message = payload["messages"][-1].get("text", "")

    response = answer(message or "")
    return jsonify({"response": response, "text": response})


# Frontend compatibility endpoints used by the existing React app.
@api.route("/api/index/<index_name>", methods=["GET"])
def index_data(index_name):
    return jsonify(index_dashboard(index_name, request.args.get("range", "1D")))


@api.route("/api/stock/<path:symbol>", methods=["GET"])
def stock_history(symbol):
    return jsonify(chart_data(symbol, request.args.get("range", "1m")))


@api.route("/api/quote/<path:symbol>", methods=["GET"])
def stock_quote(symbol):
    return jsonify(quote(symbol))


@api.route("/api/stock-info/<path:symbol>", methods=["GET"])
def info(symbol):
    return jsonify(stock_info(symbol))


@api.route("/api/market-data", methods=["GET"])
def market_data():
    return jsonify(market_news_response(fetch_news("Indian stock market", page_size=10)))


@api.route("/api/compare", methods=["GET"])
def compare_stocks():
    stocks = request.args.get("stocks", "")
    symbols = [symbol.strip() for symbol in stocks.split(",") if symbol.strip()]
    return jsonify(compare(symbols, request.args.get("range", "1m")))


@api.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    return jsonify({"message": "If the email exists, a reset link will be sent."})


@api.route("/api/reset-password", methods=["POST"])
def reset_password():
    return jsonify({"message": "Password reset request accepted."})


@api.route("/api/yahoo/quote/<path:symbol>", methods=["GET"])
def yahoo_quote(symbol):
    return jsonify(get_quote(symbol))


@api.route("/api/yahoo/history/<path:symbol>", methods=["GET"])
def yahoo_history(symbol):
    return jsonify(
        get_history(
            symbol,
            period=request.args.get("period", "1mo"),
            interval=request.args.get("interval", "1d"),
        )
    )


@api.route("/api/yahoo/info/<path:symbol>", methods=["GET"])
def yahoo_info(symbol):
    return jsonify(get_info(symbol))


@api.route("/api/yahoo/search", methods=["GET"])
def yahoo_search():
    return jsonify(search_symbols(request.args.get("q", ""), int(request.args.get("limit", 10))))
