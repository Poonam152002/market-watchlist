import { useEffect, useMemo, useState } from "react";
import { Activity, Bell, ChevronDown, Clock3, Plus, RefreshCw, Search, TrendingDown, TrendingUp, X } from "lucide-react";

const API = "http://localhost:5000";

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

const statusLabel: Record<Severity, string> = {
  IMPORTANT: "Important",
  NOTABLE: "Notable",
  NORMAL: "No major change"
};

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Stock | null>(null);
  const [error, setError] = useState("");

  async function loadStocks() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/stocks`);
      const json = await res.json();
      setStocks(json.data);
    } catch {
      setError("Backend is not running. Start it with npm run dev.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStocks(); }, []);

  async function addStock(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol.trim()) return;
    try {
      const res = await fetch(`${API}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSymbol("");
      loadStocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add stock");
    }
  }

  async function removeStock(stockSymbol: string) {
    await fetch(`${API}/api/watchlist/${stockSymbol}`, { method: "DELETE" });
    setSelected(null);
    loadStocks();
  }

  const filtered = useMemo(
    () => stocks.filter(s =>
      `${s.symbol} ${s.name}`.toLowerCase().includes(query.toLowerCase())
    ),
    [stocks, query]
  );

  const attention = stocks.filter(s => s.severity !== "NORMAL").length;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brandIcon"><Activity size={21} /></div>
          <div>
            <h1>Smart Market</h1>
            <span>Watchlist</span>
          </div>
        </div>
        <div className="topActions">
          <span className="live"><i /> Demo market live</span>
          <button className="iconBtn"><Bell size={18} /></button>
          <div className="avatar">A</div>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div>
            <p className="eyebrow">MARKET INTELLIGENCE</p>
            <h2>What changed since you last checked?</h2>
            <p className="sub">
              Your watchlist ranked by what deserves attention — not just price.
            </p>
          </div>
          <button className="refreshBtn" onClick={loadStocks}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </button>
        </section>

        {error && <div className="error">{error}</div>}

        <section className="summaryGrid">
          <div className="summaryCard">
            <span className="summaryLabel">NEEDS ATTENTION</span>
            <strong>{attention}</strong>
            <span className="summaryHint">meaningful changes detected</span>
          </div>
          <div className="summaryCard">
            <span className="summaryLabel">WATCHLIST</span>
            <strong>{stocks.length}</strong>
            <span className="summaryHint">stocks tracked</span>
          </div>
          <div className="summaryCard">
            <span className="summaryLabel">LAST CHECK</span>
            <strong>{stocks[0] ? new Date(stocks[0].lastChecked).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}) : "--"}</strong>
            <span className="summaryHint"><Clock3 size={13} /> just now</span>
          </div>
        </section>

        <div className="toolbar">
          <div className="search">
            <Search size={17} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your watchlist..." />
          </div>
          <form className="addForm" onSubmit={addStock}>
            <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="Ticker e.g. AMZN" />
            <button><Plus size={16} /> Add</button>
          </form>
          <button className="filterBtn">Attention <ChevronDown size={15} /></button>
        </div>

        <div className="sectionTitle">
          <div>
            <h3>Priority watchlist</h3>
            <p>Most important changes appear first.</p>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading market data...</div>
        ) : (
          <section className="stockGrid">
            {filtered.map(stock => (
              <article className={`stockCard ${stock.severity !== "NORMAL" ? "important" : ""}`} key={stock.symbol}>
                <div className="cardTop">
                  <div className="ticker">
                    <div className="logo">{stock.symbol.slice(0, 1)}</div>
                    <div><b>{stock.symbol}</b><span>{stock.name}</span></div>
                  </div>
                  <button className="dots" onClick={() => removeStock(stock.symbol)} title="Remove">×</button>
                </div>

                <div className="priceRow">
                  <div>
                    <div className="price">${stock.currentPrice.toFixed(2)}</div>
                    <div className={stock.changePercent >= 0 ? "up change" : "down change"}>
                      {stock.changePercent >= 0 ? <TrendingUp size={15}/> : <TrendingDown size={15}/>}
                      {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className={`score score-${stock.severity}`}>
                    <small>SCORE</small>
                    <b>{stock.attentionScore}</b>
                  </div>
                </div>

                <div className={`status ${stock.severity}`}>
                  <span className="statusDot" /> {statusLabel[stock.severity]}
                </div>

                <p className="explanation">{stock.reasons[0]}</p>

                <div className="cardBottom">
                  <span>Vol. {(stock.volume / 1000000).toFixed(1)}M</span>
                  <span>{stock.newsCount} news</span>
                  <button onClick={() => setSelected(stock)}>Why?</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {selected && (
        <div className="modalBackdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}><X size={18}/></button>
            <p className="eyebrow">CHANGE EXPLAINER</p>
            <h2>{selected.symbol} — {selected.name}</h2>
            <p className="modalLead">{statusLabel[selected.severity]} • Score {selected.attentionScore}/100</p>

            <div className="comparison">
              <div><span>Last checked</span><b>${selected.previousPrice.toFixed(2)}</b></div>
              <div className="arrow">→</div>
              <div><span>Now</span><b>${selected.currentPrice.toFixed(2)}</b></div>
            </div>

            <div className="detailList">
              <div><span>Price change</span><b>{selected.changePercent >= 0 ? "+" : ""}{selected.changePercent.toFixed(2)}%</b></div>
              <div><span>Current volume</span><b>{(selected.volume / 1000000).toFixed(1)}M</b></div>
              <div><span>Average volume</span><b>{(selected.averageVolume / 1000000).toFixed(1)}M</b></div>
              <div><span>New information</span><b>{selected.newsCount} item(s)</b></div>
            </div>

            <div className="whyBox">
              <b>Why it matters</b>
              <ul className="reasonsList">
                {selected.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
