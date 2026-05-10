import { Router, type IRouter } from "express";

const router: IRouter = Router();

// SET Marketplace API — https://marketplace.set.or.th/api/public/
// Auth: api-key passed as a request header (not query param)
const SET_API_BASE = "https://marketplace.set.or.th/api/public";
const API_KEY = process.env["SET_API_KEY"];

router.get("/set-proxy/*splat", async (req, res) => {
  if (!API_KEY) {
    res.status(500).json({ error: "SET_API_KEY is not configured on the server." });
    return;
  }

  // Express 5 captures wildcard segments as an array — join back to a path
  const raw = (req.params as Record<string, string | string[]>)["splat"] ?? "";
  const splat = Array.isArray(raw) ? raw.join("/") : raw;
  const upstreamUrl = new URL(`${SET_API_BASE}/${splat}`);

  // Forward original query params (no key in query — it goes in header)
  for (const [key, value] of Object.entries(req.query)) {
    upstreamUrl.searchParams.set(key, String(value));
  }

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      headers: {
        "Accept": "application/json",
        "api-key": API_KEY,          // SET Marketplace auth header
      },
    });

    const text = await upstream.text();

    res.status(upstream.status)
      .set("Content-Type", upstream.headers.get("content-type") ?? "application/json")
      .send(text);
  } catch (err) {
    req.log.error({ err }, "SET API proxy error");
    res.status(502).json({ error: "Failed to reach SET API upstream." });
  }
});

export default router;
