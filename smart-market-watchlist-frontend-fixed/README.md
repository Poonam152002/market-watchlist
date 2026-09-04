# Smart Market Watchlist — Frontend

## Tech stack (actual)

- Vite + React 19 + TypeScript
- Plain CSS (`styles.css`)
- `lucide-react` for icons

> Note: an earlier draft described Next.js + Tailwind CSS. The actual implementation uses Vite + React with plain CSS instead — functionally equivalent for this MVP, just a lighter setup with no server-side rendering.

## How to run

Make sure the backend is running first, on port 5000 (see backend README).

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

If you see a "Backend is not running" banner, the backend isn't up yet or isn't on port 5000 — start it first, then refresh.

## What it does

- Shows your watchlist ranked by **attention score**, not alphabetically — the stock that moved the most / has the most volume or news shows up first
- Each card shows: current price, % change, an attention score, and a status (Major move / Drop / Volume spike / New information / No major change)
- "Why?" button opens a modal comparing "last checked" vs. "now" and explaining why that stock was surfaced
- Search/filter your watchlist by symbol or name
- Add or remove tickers from the watchlist (limited to the demo market's symbol list: AAPL, NVDA, TSLA, MSFT, AMZN, GOOGL)
- Manual refresh button to re-pull the latest data

## Known limitations / next steps

- Watchlist state lives only in the backend's memory — nothing persists across devices or backend restarts
- No login/accounts, so there's only one shared watchlist
- No auto-refresh/polling — data updates only on manual refresh
