# 🔥 RoastMyWebsite

> A free AI-powered website audit tool built with Next.js and Google Gemini.

**Live Demo:** [roastmywebsite.vercel.app](https://roastmywebsite.vercel.app) *(update with your URL)*  
**Built by:** [CodeNest](https://code-nest-taupe.vercel.app) — Web & AI Studio, New Delhi

---

## What It Does

RoastMyWebsite gives anyone a brutally honest AI audit of any website in under 30 seconds — completely free. Enter a URL, and the AI reads the live page and returns:

- **Overall grade** (A through F) with a one-line verdict
- **SEO score** — title tags, meta descriptions, heading structure, keyword usage
- **UX score** — layout clarity, call-to-actions, navigation, readability
- **Performance score** — image usage, script loading, CSS bloat
- **Issues list** — specific problems ranked by severity (High / Medium / Low) with exact fixes
- **What you got right** — positives so it's not just a roast
- **CTA** — links back to CodeNest for anyone who wants the issues fixed professionally

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| AI | Google Gemini 2.5 Flash |
| Styling | Pure CSS (no Tailwind) |
| Font | Bebas Neue + DM Sans |
| Hosting | Vercel |

No database. No auth. No backend server. Just Next.js API routes + Gemini.

---

## Project Structure

```
roastmywebsite/
├── src/
│   └── app/
│       ├── page.tsx              ← Homepage with URL input
│       ├── layout.tsx            ← Root layout, loads fonts
│       ├── globals.css           ← All styles
│       ├── api/
│       │   └── roast/
│       │       └── route.ts      ← Fetches URL + calls Gemini + returns JSON report
│       └── results/
│           └── page.tsx          ← Renders the audit report
├── .env.example                  ← Environment variables template
├── next.config.mjs
└── package.json
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOURUSERNAME/roastmywebsite.git
cd roastmywebsite
npm install
```

### 2. Get a Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → **Create API key in new project**
3. Copy the key (starts with `AIza...`)

Free tier is generous — no billing needed to start.

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
GEMINI_API_KEY=AIza_your_key_here
NEXT_PUBLIC_CODENEST_URL=https://your-codenest-site.vercel.app
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try roasting any website.

---

## Deploying to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOURUSERNAME/roastmywebsite.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `roastmywebsite` GitHub repo
3. Add environment variables:
   - `GEMINI_API_KEY` = your Gemini key
   - `NEXT_PUBLIC_CODENEST_URL` = your CodeNest site URL
4. Click **Deploy**

Done — live in 2 minutes.

---

## How It Works

```
User enters URL
      ↓
Next.js API route (/api/roast)
      ↓
Fetches the live page HTML (max 15,000 chars)
      ↓
Sends HTML + URL to Gemini 2.5 Flash with a structured prompt
      ↓
Gemini returns a JSON report (grade, scores, issues, fixes)
      ↓
Results page renders the report with scores and issue cards
      ↓
CTA at bottom links back to CodeNest
```

### Why 15,000 characters?

Gemini has a context window limit. Most homepage HTML is under 15,000 characters after trimming scripts and boilerplate. Trimming keeps costs low and responses fast.

---

## Customisation

**Change the CTA link** — update `NEXT_PUBLIC_CODENEST_URL` in your `.env.local`

**Change the AI model** — in `src/app/api/roast/route.ts`:
```ts
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```
Available models: `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash-latest`

**Change example URLs** — in `src/app/page.tsx`, find the examples array:
```ts
{["stripe.com", "notion.so", "github.com"].map(...)}
```

**Add more score categories** — extend the `scores` object in the Gemini prompt inside `route.ts` and add matching cards in `results/page.tsx`

---

## Known Limitations

- Sites that **block bots** (Cloudflare protection, login walls) cannot be analysed
- Very **JavaScript-heavy SPAs** may return minimal HTML since the fetcher doesn't execute JS
- **Rate limits** apply on Gemini free tier — if you hit limits, wait a minute or upgrade to a paid key
- Results are AI-generated — treat them as a starting point, not a definitive audit

---

## Roadmap

- [ ] Share report as a public URL
- [ ] PDF export of the report
- [ ] Compare two websites side by side
- [ ] Email the report to yourself
- [ ] History of past audits (requires database)
- [ ] Webhook to notify on completion for slow sites

---

## License

MIT — free to use, modify, and deploy.

---

## About

Built by [CodeNest](https://code-nest-taupe.vercel.app) — a boutique web and AI development studio based in New Delhi, India. We build websites, UI components, AI tools, and full-stack applications.

**Contact:** chandra78.sumit1@gmail.com