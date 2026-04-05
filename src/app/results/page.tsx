"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type Report = {
  grade: "A"|"B"|"C"|"D"|"F";
  gradeTitle: string;
  gradeDesc: string;
  scores: { seo: number; ux: number; performance: number };
  issues: { title: string; description: string; fix: string; severity: "high"|"med"|"low" }[];
  positives: string[];
  summary: string;
};

const SEV_ICON = { high: "🔴", med: "🟡", low: "🟢" };
const SEV_LABEL = { high: "High", med: "Medium", low: "Low" };

function scoreClass(n: number) {
  if (n >= 75) return "score-high";
  if (n >= 50) return "score-mid";
  return "score-low";
}

const LOADING_STEPS = [
  "Fetching website HTML…",
  "Analysing page structure…",
  "Running SEO checks…",
  "Evaluating UX patterns…",
  "Generating your report…",
];

function ResultsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") ?? "";

  const [report, setReport]   = useState<Report | null>(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);
  const [step, setStep]       = useState(0);
  const fetchedRef = useRef(false);

  // Animate loading steps
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  // Fetch report once
  useEffect(() => {
    if (!url || fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Something went wrong."); }
        else { setReport(data.report); }
      } catch {
        setError("Network error — please check your connection.");
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  const codenestUrl = process.env.NEXT_PUBLIC_CODENEST_URL ?? "https://code-nest-taupe.vercel.app";
  const displayUrl = url ? new URL(url).hostname : "";

  // LOADING STATE
  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-logo">ROAST<em>MY</em>WEBSITE</div>
        <div className="spinner" />
        <div className="loading-text">Analysing {displayUrl}…</div>
        <p className="loading-sub">Our AI is reading every line of your site. This takes about 15–30 seconds.</p>
        <div className="loading-steps">
          {LOADING_STEPS.map((s, i) => (
            <div key={s} className={`loading-step ${i < step ? "done" : i === step ? "active" : ""}`}>
              <div className="step-dot" />
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error || !report) {
    return (
      <div className="results-page">
        <div className="results-nav">
          <button className="back-btn" onClick={() => router.push("/")}>← Back</button>
          <span className="results-logo">ROAST<em>MY</em>WEBSITE</span>
        </div>
        <div className="error-box">
          <strong>Could not analyse this website</strong><br />
          {error || "No report was generated."}
        </div>
        <p style={{fontSize:"14px",color:"var(--muted)",marginBottom:"16px"}}>Common reasons:</p>
        <ul style={{fontSize:"14px",color:"var(--muted)",paddingLeft:"20px",display:"flex",flexDirection:"column",gap:"6px"}}>
          <li>The site blocks bots or scrapers</li>
          <li>The URL requires login to access</li>
          <li>The site is down or very slow</li>
          <li>Invalid URL format</li>
        </ul>
        <button className="search-btn" style={{marginTop:"24px"}} onClick={() => router.push("/")}>Try Another URL</button>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* NAV */}
      <div className="results-nav">
        <button className="back-btn" onClick={() => router.push("/")}>← Roast another site</button>
        <span className="results-logo">ROAST<em>MY</em>WEBSITE</span>
      </div>

      {/* HEADER */}
      <div className="results-header">
        <div className="results-url">
          Audit for <a href={url} target="_blank" rel="noreferrer">{displayUrl}</a>
        </div>
        <h1 className="results-title">Your Website Got Roasted 🔥</h1>
        <p className="results-summary">{report.summary}</p>
      </div>

      {/* OVERALL GRADE */}
      <div className="grade-section">
        <div className={`grade-circle grade-${report.grade}`}>{report.grade}</div>
        <div>
          <div className="grade-label">Overall Grade</div>
          <div className="grade-title">{report.gradeTitle}</div>
          <div className="grade-desc">{report.gradeDesc}</div>
        </div>
      </div>

      {/* SCORES */}
      <div className="scores-grid">
        {[
          { key: "seo",         label: "SEO",         icon: "🔍" },
          { key: "ux",          label: "UX Design",   icon: "✨" },
          { key: "performance", label: "Performance", icon: "⚡" },
        ].map(({ key, label, icon }) => {
          const val = report.scores[key as keyof typeof report.scores];
          const cls = scoreClass(val);
          return (
            <div key={key} className="score-card">
              <div className="score-label">{icon} {label}</div>
              <div className={`score-num ${cls}`}>{val}<span style={{fontSize:"18px",fontWeight:400}}>/100</span></div>
              <div className="score-bar-wrap">
                <div className={`score-bar ${cls}`} style={{ width: `${val}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ISSUES */}
      <div className="section-title">Issues Found</div>
      <div className="issues-list">
        {report.issues.map((issue, i) => (
          <div key={i} className="issue-card">
            <div className="issue-icon">{SEV_ICON[issue.severity]}</div>
            <div className="issue-body">
              <div className="issue-title">{issue.title}</div>
              <div className="issue-desc">{issue.description}</div>
              <div className="issue-fix">✦ Fix: {issue.fix}</div>
            </div>
            <span className={`issue-sev sev-${issue.severity}`}>{SEV_LABEL[issue.severity]}</span>
          </div>
        ))}
      </div>

      {/* POSITIVES */}
      <div className="section-title">What You Got Right</div>
      <div className="positives-list">
        {report.positives.map((p, i) => (
          <div key={i} className="positive-item">{p}</div>
        ))}
      </div>

      {/* CTA — links to CodeNest */}
      <div className="cta-box">
        <div className="cta-title">Want Us to Fix These Issues?</div>
        <p className="cta-sub">
          CodeNest is a boutique web studio based in New Delhi. We fix exactly the kind of issues listed above — SEO, UX, performance, and more.
        </p>
        <a
          href={`${codenestUrl}/#contact`}
          target="_blank"
          rel="noreferrer"
          className="cta-btn"
        >
          Get a Free Quote from CodeNest →
        </a>
        <p className="cta-made">
          This audit was made by <a href={codenestUrl} target="_blank" rel="noreferrer">CodeNest</a> — Web Development &amp; AI Studio, New Delhi
        </p>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="loading-page">
        <div className="loading-logo">ROAST<em>MY</em>WEBSITE</div>
        <div className="loading-fire">🔥</div>
        <div className="loading-text">Loading…</div>
      </div>
    }>
      <ResultsInner />
    </Suspense>
  );
}