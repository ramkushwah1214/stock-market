# AI Invest Backend

Production-style Flask backend for the React stock dashboard.

## Features

- Real stock and index data from `yfinance`
- News from NewsAPI
- VADER sentiment analysis
- TensorFlow/Keras LSTM trend prediction
- RSI and 20-period moving average
- Decision engine for `BUY`, `HOLD`, `SELL`
- CORS enabled for Vite/React

## Structure

```text
backend/
├── app.py
├── run.py
├── app/
│   ├── api/routes.py
│   ├── models/lstm_model.py
│   └── services/
│       ├── stock_data.py
│       ├── market_service.py
│       ├── news_service_v2.py
│       ├── sentiment_service.py
│       ├── indicator_service.py
│       ├── decision_service.py
│       ├── symbol_service.py
│       └── chat_service.py
├── requirements.txt
└── Dockerfile
```

## Run Locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python app.py
```

Set `NEWS_API_KEY` in `.env` for live news.

## Endpoints

- `GET /analyze?symbol=TCS`
- `GET /chart?symbol=RELIANCE&range=1m`
- `GET /movers?type=gainers`
- `GET /sectors`
- `POST /chat` with `{ "message": "What is RSI?" }`

The existing React app is also supported through `/api/...` compatibility routes.

Plain stock symbols are treated as Indian NSE symbols. For example, `TCS` is resolved as `TCS.NS`.

## Docker

```bash
docker build -t ai-invest-backend .
docker run -p 5000:5000 --env-file .env ai-invest-backend
```
