import os

from app import create_app


app = create_app()
application = app


def _route_list(flask_app):
    visible_routes = []
    for rule in sorted(flask_app.url_map.iter_rules(), key=lambda item: item.rule):
        if rule.rule.startswith("/static"):
            continue
        methods = ",".join(sorted(method for method in rule.methods if method in {"GET", "POST", "PUT", "PATCH", "DELETE"}))
        visible_routes.append(f"{methods:>6}  {rule.rule}")
    return visible_routes


def main():
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("PORT", os.getenv("FLASK_PORT", "5000")))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"

    print("Backend running with routes:")
    for route in _route_list(app):
        print(f"  {route}")

    app.run(host=host, port=port, debug=debug)


if __name__ == "__main__":
    main()
