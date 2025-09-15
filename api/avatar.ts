// /api/avatar.ts  — Vercel Serverless Function
import type { VercelRequest, VercelResponse } from "@vercel/node";

/** очередность источников: unavatar -> зеркало x -> генеративный бэкап */
const SOURCES = (h: string) => [
  `https://unavatar.io/twitter/${encodeURIComponent(h)}`,
  `https://unavatar.io/x/${encodeURIComponent(h)}`,
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const handle = String(req.query.handle || "").replace(/^@/, "");
  if (!handle) return res.status(400).send("handle required");

  for (const url of SOURCES(handle)) {
    try {
      const r = await fetch(url, {
        // не передаём реферер на сторонний домен
        referrerPolicy: "no-referrer",
        headers: { "User-Agent": "OrdoMemeticusAvatar/1.0" },
      });
      if (!r.ok) continue;

      const type = r.headers.get("content-type") || "image/png";
      const buf = Buffer.from(await r.arrayBuffer());

      res.setHeader("Content-Type", type);
      // кэш CDN/браузера на сутки + SWR на неделю
      res.setHeader(
        "Cache-Control",
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
      );
      return res.status(200).send(buf);
    } catch {
      // пробуем следующий источник
    }
  }

  // наш локальный фолбэк из /public
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host;
  const fb = await fetch(`${proto}://${host}/avatar-fallback.png`);
  const buf = Buffer.from(await fb.arrayBuffer());

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  return res.status(200).send(buf);
}
