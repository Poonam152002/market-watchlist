# Smart Market Watchlist

A stock watchlist app I built to track price and volume changes for a few stocks I follow. Instead of just showing raw prices, it calculates an attention score for each stock based on how much it moved, volume compared to average, and related news — so I can quickly tell what actually matters and what's just normal noise.

Live: https://market-watchlist-eta.vercel.app

## What it does

- Shows a watchlist of stocks with current price, % change, and volume
- Calculates a score (0-100) for each stock based on how significant the change is
- Click "Why?" on any stock to see the reasoning behind its score
- Add or remove stocks from your watchlist by ticker symbol
- Search through your watchlist
- Dashboard shows how many stocks need attention right now

## How to use

- Search box filters stocks already in your watchlist by name or symbol
- Type a ticker (like AMZN) in the "Ticker" field and click Add to track a new stock
- Click "Why?" on any card to see the reasoning behind that stock's attention score
- Use the Attention dropdown to filter by how significant the change is
- Click the moon/sun icon in the top right to switch between light and dark mode
- Click the × on any card to remove it from your watchlist

## Tech used

Frontend: React + TypeScript, built with Vite
Backend: Node.js + Express
Hosted on Vercel (frontend) and Render (backend)

## Running it locally

Frontend:
\`\`\`
cd smart-market-watchlist-frontend-fixed
npm install
npm run dev
\`\`\`

Backend:
\`\`\`
cd smart-market-watchlist-backend
npm install
npm run dev
\`\`\`

You'll need a `.env` file in the frontend folder:
\`\`\`
VITE_API_BASE_URL=http://localhost:5000
\`\`\`

## API routes

- GET /api/stocks - get all stocks in the watchlist with their scores
- POST /api/watchlist - add a stock (send symbol in the body)
- DELETE /api/watchlist/:symbol - remove a stock
- GET /api/health - check if backend is up

## Things I want to add later

- Connect to a real stock market API instead of demo data
- Price history charts
- Alerts when a stock crosses a certain threshold
- Login so different users can have their own watchlists

---
Built by POONAAM RAO
