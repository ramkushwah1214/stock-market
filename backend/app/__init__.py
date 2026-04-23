from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.exceptions import HTTPException
import yfinance as yf

from app.api.routes import api
from app.config import CACHE_DIR, Config


def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config.from_object(Config)

    if hasattr(yf, "set_tz_cache_location"):
        yf.set_tz_cache_location(str(CACHE_DIR / "yfinance"))

    CORS(app, resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=True)
    app.register_blueprint(api)

    @app.errorhandler(404)
    def not_found(error):
        if request.url_rule is None:
            return {"error": "Endpoint not found"}, 404
        return {"error": getattr(error, "description", "Resource not found")}, 404

    @app.errorhandler(HTTPException)
    def http_error(error):
        return {"error": error.description}, error.code

    @app.errorhandler(500)
    def server_error(error):
        return {"error": "Internal server error"}, 500

    return app
