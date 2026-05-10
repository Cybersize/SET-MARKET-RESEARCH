import { Router, type IRouter } from "express";

const router: IRouter = Router();

const SET_API_BASE = "https://api.settrade.com/api";
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

  // Forward original query params
  for (const [key, value] of Object.entries(req.query)) {
    upstreamUrl.searchParams.set(key, String(value));
  }

  // Inject API key
  upstreamUrl.searchParams.set("apiKey", API_KEY);

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    const text = await upstream.text();

    res.status(upstream.status)
      .set("Content-Type", "application/json")
      .send(text);
  } catch (err) {
    req.log.error({ err }, "SET API proxy error");
    res.status(502).json({ error: "Failed to reach SET API upstream." });
  }
});

export default router;
