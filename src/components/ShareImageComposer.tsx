import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

export type ShareImageComposerHandle = {
    copyImage: () => Promise<boolean>;
    downloadPNG: () => void;
    redraw: () => Promise<void>;
};

type Props = {
    title: string;
    subtitle?: string;
    cornerSrc?: string;
    sideSrc?: string;
    cardImages?: string[];
    /** если true — canvas скрыт */
    compact?: boolean;
};

const W = 1200, H = 630;
const PAD = 48;
const TILE = 32;
const defaultCards = Array.from({ length: 13 }, (_, i) => `/cards/${i + 1}.jpg`);

function hash(s: string) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
}
const rand = (seed: number) => {
    let x = seed || 1;
    return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; };
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
    const words = text.split(/\s+/); const lines: string[] = []; let line = "";
    for (const w of words) {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    return lines;
}

async function loadImage(src: string) {
    return new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
    });
}

const ShareImageComposer = forwardRef<ShareImageComposerHandle, Props>(function ShareImageComposer(
    {
        title,
        subtitle = "ORDO MEMETICUS · $ORDEN · ordomemeticus.lol",
        cornerSrc = "/corner_tile.png",
        sideSrc = "/side_tile.png",
        cardImages = defaultCards,
        compact = true,
    },
    ref
) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const seed = hash(title);

    useEffect(() => { void draw(); }, [title, subtitle, cornerSrc, sideSrc, seed]);

    async function draw() {
        const c = canvasRef.current; if (!c) return;
        const ctx = c.getContext("2d"); if (!ctx) return;

        // base bg
        ctx.clearRect(0, 0, W, H);
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "#0b0a09"); g.addColorStop(1, "#1a1511");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

        // collage
        const r = rand(seed);
        const chosen = [...cardImages];
        // перетасуем и возьмем 6
        for (let i = chosen.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1));[chosen[i], chosen[j]] = [chosen[j], chosen[i]]; }
        const cells = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }];
        const cellW = Math.ceil(W / 3), cellH = Math.ceil(H / 2);

        try {
            for (let i = 0; i < 6; i++) {
                const img = await loadImage(chosen[i % chosen.length]);
                const { x, y } = cells[i]; const cx = x * cellW, cy = y * cellH;
                const scale = Math.max(cellW / img.width, cellH / img.height) * (1 + r() * 0.15);
                const dw = img.width * scale, dh = img.height * scale;
                const dx = cx + (cellW - dw) / 2, dy = cy + (cellH - dh) / 2;
                ctx.save();
                const angle = (r() - 0.5) * 0.12;
                ctx.translate(cx + cellW / 2, cy + cellH / 2); ctx.rotate(angle); ctx.translate(-(cx + cellW / 2), -(cy + cellH / 2));
                // @ts-ignore
                ctx.filter = "grayscale(100%) brightness(45%) contrast(115%)"; ctx.globalAlpha = 0.22;
                ctx.drawImage(img, dx, dy, dw, dh);
                ctx.restore();
            }
        } catch { }

        // halo
        const rad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, Math.max(W, H) / 1.2);
        rad.addColorStop(0, "rgba(255,220,140,0.20)");
        rad.addColorStop(0.35, "rgba(255,180,60,0.10)");
        rad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = rad; ctx.fillRect(0, 0, W, H);

        // sides first
        const side = await loadImage(sideSrc);
        for (let x = TILE; x <= W - TILE - 1; x += TILE) ctx.drawImage(side, x, 0, TILE, TILE);
        ctx.save(); ctx.translate(0, H); ctx.scale(1, -1);
        for (let x = TILE; x <= W - TILE - 1; x += TILE) ctx.drawImage(side, x, 0, TILE, TILE);
        ctx.restore();
        ctx.save(); ctx.translate(0, TILE); ctx.rotate(-Math.PI / 2);
        for (let y = TILE; y <= H - TILE - 1; y += TILE) ctx.drawImage(side, -y, 0, TILE, TILE);
        ctx.restore();
        ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); ctx.translate(0, TILE); ctx.rotate(-Math.PI / 2);
        for (let y = TILE; y <= H - TILE - 1; y += TILE) ctx.drawImage(side, -y, 0, TILE, TILE);
        ctx.restore();

        // corners on top
        const corner = await loadImage(cornerSrc);
        ctx.drawImage(corner, 0, 0, TILE, TILE);
        ctx.drawImage(corner, W - TILE, 0, TILE, TILE);
        ctx.drawImage(corner, W - TILE, H - TILE, TILE, TILE);
        ctx.drawImage(corner, 0, H - TILE, TILE, TILE);

        // title
        const innerW = W - PAD * 2;
        ctx.textBaseline = "top"; ctx.textAlign = "center"; ctx.fillStyle = "#f5e7c5";
        let fontSize = 64;
        ctx.font = `700 ${fontSize}px "UnifrakturCook", "Cinzel", serif`;
        let lines = wrapText(ctx, title, innerW * 0.88);
        while (lines.length > 2 && fontSize > 34) {
            fontSize -= 4; ctx.font = `700 ${fontSize}px "UnifrakturCook", "Cinzel", serif`;
            lines = wrapText(ctx, title, innerW * 0.88);
        }
        ctx.shadowColor = "rgba(255,210,120,0.4)"; ctx.shadowBlur = 24;
        const blockH = lines.length * (fontSize + 8); let ty = (H - blockH) / 2 - 40;
        lines.forEach((ln, i) => ctx.fillText(ln, W / 2, ty + i * (fontSize + 8)));

        // subtitle
        ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,220,170,0.95)"; ctx.font = `600 28px "Cinzel", serif`;
        ctx.fillText(subtitle, W / 2, ty + blockH + 28);

        // cache url
        await new Promise<void>(res => c.toBlob((blob) => {
            if (blob) {
                if (url) URL.revokeObjectURL(url);
                setUrl(URL.createObjectURL(blob));
            }
            res();
        }, "image/png"));
    }

    // expose methods
    useImperativeHandle(ref, () => ({
        copyImage: async () => {
            const c = canvasRef.current; if (!c) return false;
            const blob: Blob | null = await new Promise(res => c.toBlob(b => res(b), "image/png"));
            if (!blob) return false;
            // @ts-ignore
            if (navigator.clipboard && window.ClipboardItem) {
                // @ts-ignore
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                return true;
            }
            return false;
        },
        downloadPNG: () => {
            const a = document.createElement("a");
            a.download = "ordo-title.png";
            a.href = url || canvasRef.current?.toDataURL("image/png") || "#";
            a.click();
        },
        redraw: draw
    }), [url, title]);

    return (
        <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{ display: compact ? "none" : "block", width: "100%", height: "auto", scale: "0.7",borderRadius: 8, background: "#0b0a09" }}
        />
    );
});

export default ShareImageComposer;
