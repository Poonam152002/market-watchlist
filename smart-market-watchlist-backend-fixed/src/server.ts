import express from "express";
import cors from "cors";

type Severity = "IMPORTANT" | "NOTABLE" | "NORMAL";

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  volume: number;
  averageVolume: number;
  newsCount: number;
  severity: Severity;
  attentionScore: number;
  reasons: string[];
  lastChecked: string;
}

const app = express();
app.use(cors());
app.use(express.json());

let watchlist = ["AAPL", "NVDA", "TSLA", "MSFT"];

const market = [
  { symbol: "AAPL", name: "Apple Inc.", currentPrice: 245.30, previousPrice: 231.20, volume: 85000000, averageVolume: 50000000, newsCount: 2 },
  { symbol: "NVDA", name: "NVIDIA", currentPrice: 168.40, previousPrice: 173.50, volume: 42000000, averageVolume: 40000000, newsCount: 0 },
  { symbol: "TSLA", name: "Tesla", currentPrice: 351.20, previousPrice: 351.00, volume: 100000000, averageVolume: 35000000, newsCount: 0 },
  { symbol: "MSFT", name: "Microsoft", currentPrice: 510.20, previousPrice: 507.90, volume: 25000000, averageVolume: 22000000, newsCount: 1 },
  { symbol: "AMZN", name: "Amazon", currentPrice: 231.60, previousPrice: 228.20, volume: 39000000, averageVolume: 30000000, newsCount: 1 },
  { symbol: "GOOGL", name: "Alphabet", currentPrice: 214.10, previousPrice: 213.80, volume: 19000000, averageVolume: 21000000, newsCount: 0 }
];

function changePercent(current: number, previous: number) {
  return previous === 0 ? 0 : ((current - previous) / previous) * 100;
}

// Point-based "meaningful change" scoring:
//   +30 if price moved 3% or more (either direction)
//   +25 if volume is at least 2x the average
//   +25 if price moved 5% or more (either direction)
//   Severity: score >= 60 -> IMPORTANT, score >= 30 -> NOTABLE, else NORMAL
function calculateChange(change: number, volume: number, averageVolume: number, newsCount: number) {
  const reasons: string[] = [];
  let score = 0;

  if (Math.abs(change) >= 3) {
    score += 30;
    reasons.push(`Price moved ${Math.abs(change).toFixed(2)}% since your last check`);
  }
  if (volume >= averageVolume * 2) {
    score += 25;
    reasons.push(`Volume is ${(volume / averageVolume).toFixed(1)}x normal`);
  }
  if (Math.abs(change) >= 5) {
    score += 25;
    reasons.push("Move is large enough to be a major swing");
  }
  if (newsCount > 0) {
    reasons.push(`${newsCount} new update${newsCount > 1 ? "s" : ""} since your last check`);
  }
  if (reasons.length === 0) {
    reasons.push("Nothing significant has changed");
  }

  let severity: Severity = "NORMAL";
  if (score >= 60) severity = "IMPORTANT";
  else if (score >= 30) severity = "NOTABLE";

  return { score, severity, reasons };
}

function getStocks(): Stock[] {
  return market
    .filter((s) => watchlist.includes(s.symbol))
    .map((s) => {
      const change = changePercent(s.currentPrice, s.previousPrice);
      const { score, severity, reasons } = calculateChange(change, s.volume, s.averageVolume, s.newsCount);
      return {
        ...s,
        changePercent: Number(change.toFixed(2)),
        severity,
        attentionScore: score,
        reasons,
        lastChecked: new Date().toISOString()
      };
    })
    .sort((a, b) => b.attentionScore - a.attentionScore);
}

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Smart Market backend is running" });
});

app.get("/api/stocks", (_req, res) => {
  res.json({ success: true, data: getStocks(), updatedAt: new Date().toISOString() });
});

app.get("/api/watchlist", (_req, res) => {
  res.json({ success: true, data: watchlist });
});

app.post("/api/watchlist", (req, res) => {
  const symbol = String(req.body?.symbol || "").toUpperCase();
  if (!symbol) return res.status(400).json({ success: false, error: "Symbol is required" });
  if (!market.some((s) => s.symbol === symbol)) {
    return res.status(404).json({ success: false, error: "Stock is not available in the demo market" });
  }
  if (!watchlist.includes(symbol)) watchlist.push(symbol);
  res.json({ success: true, data: watchlist });
});

app.delete("/api/watchlist/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  watchlist = watchlist.filter((s) => s !== symbol);
  res.json({ success: true, data: watchlist });
});

app.listen(5000, () => {
  console.log("Smart Market backend running at http://localhost:5000");
});
