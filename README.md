# Stock Market Mini Project

This project is arranged as a full-stack application:

- `frontend/` - React + Vite user interface.
- `backend/` - Python Flask API for stock analysis, indicators, LSTM prediction, news, and sentiment.

## Project Architecture

```text
stock market 2.2/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py              # Flask API endpoints
│   │   ├── models/
│   │   │   └── lstm_model.py          # LSTM training and prediction
│   │   ├── services/
│   │   │   ├── news_service.py        # News API integration
│   │   │   └── stock_data.py          # Stock fetching and analysis workflow
│   │   └── utils/
│   │       ├── decision_engine.py     # Buy/sell/hold decision logic
│   │       ├── indicators.py          # Technical indicators
│   │       └── sentiment.py           # News sentiment analysis
│   ├── requirements.txt
│   └── run.py                         # Backend entry point
├── frontend/
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   ├── contexts/                  # React context providers
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── pages/                     # Application pages
│   │   ├── App.tsx                    # Route definitions
│   │   └── main.tsx                   # React entry point
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

The backend runs at `http://localhost:5000`.

Optional: create `backend/.env` or set an environment variable named `NEWS_API_KEY` if you want live news data.

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at the Vite URL shown in the terminal. API calls beginning with `/api` and `/analyze` are proxied to the backend.

## Main API Endpoints

- `GET /api/health` - backend health check.
- `GET /analyze?symbol=TCS` - analyze an NSE stock symbol.
