// src/app/api/roast/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PROMPT = `You are a brutally honest but constructive web design and SEO expert.
Analyse the following website HTML and URL, then return ONLY a valid JSON object (no markdown, no backticks, no explanation).

The JSON must follow this exact structure:
{
  "grade": "B",
  "gradeTitle": "Needs Work",
  "gradeDesc": "One sentence summary of the overall site quality.",
  "scores": {
    "seo": 72,
    "ux": 58,
    "performance": 65
  },
  "issues": [
    {
      "title": "Missing meta description",
      "description": "The page has no meta description tag which hurts click-through rates in search results.",
      "fix": "Add a compelling 150-160 character meta description to every page.",
      "severity": "high"
    }
  ],
  "positives": [
    "Clear navigation structure with logical menu hierarchy",
    "Good use of heading tags (H1, H2, H3)"
  ],
  "summary": "2-3 sentence honest overall summary of the site."
}

Rules:
- grade must be one of: A, B, C, D, F
- gradeTitle: "Excellent" for A, "Good" for B, "Needs Work" for C, "Poor" for D, "Critical Issues" for F
- scores must be 0-100 integers
- issues: 3 to 6 items, severity must be "high", "med", or "low"
- positives: 2 to 4 items as plain strings
- Be specific and actionable — reference actual content from the page
- Do NOT wrap in markdown code blocks
- Return ONLY the raw JSON`;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // Validate URL
    let parsedUrl: URL;
    try { parsedUrl = new URL(url); } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch the website HTML
    let html = "";
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(parsedUrl.href, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RoastMyWebsite/1.0; +https://roastmywebsite.vercel.app)",
        },
      });
      clearTimeout(timeout);
      const raw = await res.text();
      // Trim to 15000 chars so we don't blow Gemini's context
      html = raw.slice(0, 15000);
    } catch (e: any) {
      if (e?.name === "AbortError") {
        return NextResponse.json({ error: "The website took too long to respond (>10s). Try another URL." }, { status: 408 });
      }
      return NextResponse.json({ error: "Could not fetch the website. It may be blocking bots or offline." }, { status: 422 });
    }

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      `URL: ${parsedUrl.href}\n\nHTML:\n${html}\n\n${PROMPT}`
    );

    const text = result.response.text().trim();

    // Parse JSON — strip any accidental backticks
    const clean = text.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();

    let report;
    try {
      report = JSON.parse(clean);
    } catch {
      console.error("Gemini returned non-JSON:", text.slice(0, 500));
      return NextResponse.json({ error: "AI returned an unexpected response. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ report, url: parsedUrl.href });

  } catch (e: any) {
    console.error("[/api/roast]", e?.message);
    return NextResponse.json({ error: e?.message ?? "Something went wrong. Please try again." }, { status: 500 });
  }
}
