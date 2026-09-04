# Smart Market Watchlist — Backend

## Concept

A watchlist shouldn't just show prices — it should tell you **what actually deserves your attention since you last looked**. Every stock in the watchlist is scored on how "meaningful" its change is, using:

- **Price movement** — how far the price moved vs. the last check
- **Volume vs. average** — is trading activity unusually high right now
- **News volume** — how much new information has landed

The score decides both a **status label** (e.g. Major move, Volume spike, No change) and an **attention score (0–100)**, and the watchlist is sorted so the stock most worth your attention shows up first — not just alphabetically or by raw price change.

## Tech stack (actual)

- Node.js + TypeScript
- Express 5
- In-memory demo market data (no database — resets on server restart)

> Note: an earlier draft of this project described a Python/FastAPI + PostgreSQL + Redis stack. This implementation is Node/Express with in-memory data instead — simpler to run for an MVP, but it means no persistence and no real-time market feed yet (see Limitations below).

## How to run

```bash
npm install
npm run dev
```

Runs at: `http://localhost:5000`

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/stocks` | Watchlist stocks with computed status + attention score, sorted by score |
| GET | `/api/watchlist` | Just the list of tracked symbols |
| POST | `/api/watchlist` | Add a symbol — body: `{ "symbol": "AAPL" }` |
| DELETE | `/api/watchlist/:symbol` | Remove a symbol |

## Current scoring logic

```ts
movement    = min(|changePercent| * 7, 50)
volumeScore = min(max((volume / averageVolume - 1) * 20, 0), 30)
newsScore   = min(newsCount * 10, 20)
attentionScore = min(movement + volumeScore + newsScore, 100)

status:
  changePercent >= 5        -> MAJOR_MOVE
  changePercent <= -5       -> DROP
  volume >= averageVolume*2 -> VOLUME_SPIKE
  newsCount > 0              -> NEWS
  else                       -> NO_CHANGE
```

This is a different formula from the original 30/25/25-point design (IMPORTANT ≥60 / NOTABLE ≥30 / NORMAL). Both are valid approaches — the code currently uses the version above. Want it switched to match the original point-based formula exactly? Happy to make that change.

## Known limitations / next steps

- No database — data resets whenever the server restarts
- No caching layer (Redis)
- Uses hardcoded demo market data, not a real market-data provider
- Single global watchlist — no user accounts or per-device persistence
- No delay/staleness/conflicting-data handling yet — market data is static in-memory, not live
