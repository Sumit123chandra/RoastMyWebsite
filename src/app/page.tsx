"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function normalizeUrl(input: string) {
    const t = input.trim();
    if (!t) return "";
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    return "https://" + t;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    try { new URL(normalized); } catch {
      setError("Please enter a valid URL — e.g. yoursite.com");
      return;
    }
    router.push(`/results?url=${encodeURIComponent(normalized)}`);
  }

  const codenestUrl = process.env.NEXT_PUBLIC_CODENEST_URL ?? "#";
  const features = ["SEO Analysis","UX Review","Performance","Accessibility","Mobile Check","Security Scan","SEO Analysis","UX Review","Performance","Accessibility","Mobile Check","Security Scan"];

  return (
    <div className="home">
      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">ROAST<em>MY</em>WEBSITE</span>
        <div className="nav-right">
          <span className="nav-tag">Free Tool</span>
          <a href={codenestUrl} target="_blank" rel="noreferrer" className="nav-link">Built by CodeNest →</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">AI Website Audit</div>
          <h1>WE&apos;LL<br/><em>ROAST</em><br/>YOUR<br/>SITE</h1>
          <p className="hero-desc">
            Enter any URL and get a brutally honest AI audit — SEO, UX, performance, and accessibility — in under 30 seconds. Free, forever.
          </p>

          <div className="search-wrap">
            <form onSubmit={handleSubmit}>
              <div className="search-row">
                <input
                  className="search-input"
                  type="text"
                  placeholder="yourwebsite.com"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  autoFocus
                />
                <button className="search-btn" type="submit" disabled={!url.trim()}>
                  Roast It 🔥
                </button>
              </div>
              {error && <p className="search-error">{error}</p>}
            </form>

            <div className="search-examples">
              <span>Try:</span>
              {["stripe.com","notion.so","github.com"].map(ex => (
                <button key={ex} className="example-btn" onClick={() => setUrl("https://" + ex)}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="fire-big">🔥</div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">30s</div>
              <div className="hero-stat-lbl">Full Audit</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">6+</div>
              <div className="hero-stat-lbl">Categories</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">AI</div>
              <div className="hero-stat-lbl">Powered</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">Free</div>
              <div className="hero-stat-lbl">Always</div>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLLING FEATURES STRIP */}
      <div className="features-strip">
        <div className="features-track">
          {features.map((f, i) => (
            <div key={i} className="feat-item">
              <span className="feat-dot" />
              {f}
            </div>
          ))}
        </div>
        <div className="features-track" aria-hidden>
          {features.map((f, i) => (
            <div key={i} className="feat-item">
              <span className="feat-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="how-section">
        {[
          { n:"01", title:"Enter any URL", desc:"Paste any website address — your own site, a competitor, or a client's. No login required." },
          { n:"02", title:"AI reads everything", desc:"Our AI fetches the live page and analyses the HTML, structure, content, and metadata in seconds." },
          { n:"03", title:"Get your report", desc:"Receive scored feedback on SEO, UX, performance, and more — with specific fixes you can act on today." },
        ].map(s => (
          <div key={s.n} className="how-step">
            <div className="how-num">{s.n}</div>
            <div className="how-title">{s.title}</div>
            <p className="how-desc">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <span>RoastMyWebsite — Free AI audits for everyone</span>
        <span>Built by <a href={codenestUrl} target="_blank" rel="noreferrer">CodeNest</a> · Web &amp; AI Studio, New Delhi</span>
      </footer>
    </div>
  );
}
