import { useEffect, useRef } from "react";

type Props = {
    src: string;
    alt?: string;
    maxH?: string;       // например "50vh"
    className?: string;  // дополнительные классы контейнера
};

export default function ParallaxImage({
    src,
    alt = "",
    maxH = "50vh",
    className = "",
}: Props) {
    const plateRef = useRef<HTMLDivElement | null>(null);
    const frame = useRef<number | null>(null);

    // Безопасный сброс (никогда не падает)
    const reset = () => {
        const el = plateRef.current;
        if (!el) return;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--tx", "0px");
        el.style.setProperty("--ty", "0px");
        el.style.setProperty("--tz", "0px");
    };

    // Pointer-события (и мышь, и тач), с rAF, с жёсткими проверками
    const onMove = (e: React.PointerEvent) => {
        const host = e.currentTarget as HTMLElement | null;
        const el = plateRef.current;
        if (!host || !el) return;

        // на iOS иногда event «зависает» — считаем всё в rAF
        if (frame.current) cancelAnimationFrame(frame.current);
        const { clientX, clientY } = e;
        frame.current = requestAnimationFrame(() => {
            try {
                const r = host.getBoundingClientRect();
                const nx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
                const ny = Math.min(1, Math.max(0, (clientY - r.top) / r.height));

                // коэффициенты — тут можно крутить цифры
                const rx = (0.5 - ny) * 55;   // ↑/↓ наклон
                const ry = (nx - 0.5) * 55;   // ←/→ наклон
                const tx = (nx - 0.5) * 30;   // сдвиг X
                const ty = (ny - 0.5) * -20;  // сдвиг Y

                el.style.setProperty("--rx", `${rx}deg`);
                el.style.setProperty("--ry", `${ry}deg`);
                el.style.setProperty("--tx", `${tx}px`);
                el.style.setProperty("--ty", `${ty}px`);
                el.style.setProperty("--tz", `16px`);   // «высота»
            } catch { /* гасим любые редкие ошибки DOM */ }
        });
    };

    const onLeave = () => {
        if (frame.current) { cancelAnimationFrame(frame.current); frame.current = null; }
        reset();
    };

    // При смене src гарантированно сбрасываем и слегка приподнимаем
    useEffect(() => {
        reset();
        const el = plateRef.current;
        if (el) el.style.setProperty("--tz", "20px");
        return () => { if (frame.current) cancelAnimationFrame(frame.current); };
    }, [src]);

    return (
        <div
            key={src} // форс-ремоунт при смене изображения
            className={`relative h-full w-full perspective-1000 ${className}`}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            style={{ touchAction: "none" }} // чтобы pointermove не гасился скроллом
        >
            <div
                ref={plateRef}
                className="preserve-3d tilt-3d flex items-center justify-center rounded-l-2xl md:rounded-l-2xl md:rounded-r-none"
            >
                <img
                    src={src}
                    alt={alt}
                    className="lift-3d backface-hidden block w-auto object-contain parallax-shadow"
                    style={{ maxHeight: `var(--maxH, ${maxH})` }}
                />
            </div>
        </div>
    );
}
