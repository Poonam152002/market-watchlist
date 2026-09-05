# 📊 Smart Market Watchlist

A real-time stock watchlist app that highlights **meaningful changes** — not just price movements. Instead of showing every fluctuation, it scores each stock based on price change, volume, and news activity to surface what actually deserves your attention.

🔗 **Live Demo:** [market-watchlist-eta.vercel.app](https://market-watchlist-eta.vercel.app)

## ✨ Features

- 📈 Real-time price and volume tracking for watchlisted stocks
- 🎯 Attention score (0–100) that ranks stocks by significance of change
- 🔍 Search and filter your watchlist
- ➕ Add/remove stocks by ticker symbol
- 💡 "Why?" explainer modal showing reasons behind each score
- 📊 Summary dashboard: stocks needing attention, total tracked, last check time

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, Lucide Icons
**Backend:** Node.js, Express
**Deployment:** Vercel (frontend), Render (backend)

## 🚀 Getting Started

### Frontend
\`\`\`bash
cd smart-market-watchlist-frontend-fixed
npm install
npm run dev
\`\`\`

### Backend
\`\`\`bash
cd smart-market-watchlist-backend
npm install
npm run dev
\`\`\`

Create a \`.env\` file in the frontend with:
\`\`\`
VITE_API_BASE_URL=http://localhost:5000
\`\`\`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stocks | Fetch all watchlisted stocks with scores |
| POST | /api/watchlist | Add a stock by symbol |
| DELETE | /api/watchlist/:symbol | Remove a stock from watchlist |
| GET | /api/health | Backend health check |

## 📌 Roadmap

- [ ] Integrate live stock market API (Alpha Vantage / Finnhub)
- [ ] Price alert notifications
- [ ] Historical price charts
- [ ] User authentication for personalized watchlists

## 👩‍💻 Author

**POONAM RAO ** — Built as part of placement portfolio preparation.
