// /api/avatar.ts — Vercel Edge Function (без robohash)
export const config = { runtime: "edge" };

const SOURCES = (h: string) => [
  `https://unavatar.io/twitter/${encodeURIComponent(h)}`,
  `https://unavatar.io/x/${encodeURIComponent(h)}`,
];

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const handle = (url.searchParams.get("handle") || "").replace(/^@/, "");
  if (!handle) return new Response("handle required", { status: 400 });

  for (const src of SOURCES(handle)) {
    try {
      const r = await fetch(src, {
        headers: {
          // на всякий: явно просим картинку и ставим UA
          Accept: "image/*",
          "User-Agent": "OrdoMemeticusAvatar/1.0",
        },
        redirect: "follow",
      });
      if (!r.ok) continue;

      const type = r.headers.get("content-type") || "image/png";
      const headers = new Headers({
        "Content-Type": type,
        // кэш: сутки + SWR на неделю
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      });
      return new Response(r.body, { headers });
    } catch {
      // пробуем следующий источник
    }
  }

  // локальный фолбэк из /public
  const fb = await fetch(new URL("/avatar-fallback.png", url.origin));
  const headers = new Headers({
    "Content-Type": fb.headers.get("content-type") || "image/png",
    "Cache-Control": "public, max-age=31536000, immutable",
  });
  return new Response(fb.body, { headers });
}
