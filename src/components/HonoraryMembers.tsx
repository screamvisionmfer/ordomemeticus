import React from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

/* ================= types & helpers ================= */

type Props = {
    title?: string;
    members: string[];     // ссылки или @handle
    visible?: number;      // максимум видимых (жёстко ограничим 12)
    interval?: number;     // мс между заменами (по умолчанию 15000)
};

type Member = { url: string; handle: string };

const toHandle = (s: string) =>
    s
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/^(www\.)?x\.com\//i, "")
        .replace(/^(www\.)?twitter\.com\//i, "")
        .replace(/^@/, "")
        .split(/[/?#]/)[0];

/** Цепочка источников (без локального fallback — он рендерится фоном) */
const srcChain = (h: string) => [
    `/api/avatar?handle=${encodeURIComponent(h)}`,  // ← наш прокси
    `https://unavatar.io/x/${encodeURIComponent(h)}`, // можно оставить как запасной
    `https://unavatar.io/twitter/${encodeURIComponent(h)}`,
];



const FALLBACK = "/avatar-fallback.png"; // положи файл в /public

/* ================= motions ================= */

const titleVariants = {
    initial: { opacity: 0, y: -16, scale: 0.98, filter: "blur(4px)" as any },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)" as any,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const gridStagger = {
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const cardEnter = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.95,
        rotateZ: -2,
        filter: "blur(6px)" as any,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        filter: "blur(0px)" as any,
        transition: { type: "spring", stiffness: 260, damping: 28 },
    },
    exit: {
        opacity: 0,
        y: 20,
        scale: 0.95,
        rotateZ: 2,
        filter: "blur(6px)" as any,
        transition: { duration: 0.25 },
    },
};

/* ================= main ================= */

export default function HonoraryMembers({
    title = "HONORARY MEMBERS",
    members,
    visible = 12,
    interval = 15000,
}: Props) {
    const canHover =
        typeof window !== "undefined" &&
        window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pool = React.useMemo<Member[]>(() => {
        const list: Member[] = [];
        for (const link of members) {
            const h = toHandle(link);
            if (h) list.push({ url: `https://x.com/${h}`, handle: h });
        }
        // shuffle
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }, [members]);

    // фикс-слоты: максимум 12
    const maxVisible = Math.min(12, visible);
    const initialSlots = React.useMemo(
        () => pool.slice(0, Math.min(maxVisible, pool.length)),
        [pool, maxVisible]
    );
    const [slots, setSlots] = React.useState<Member[]>(initialSlots);

    // «тик» при возврате со вкладки — перемонтируем карточки
    const [refreshTick, setRefreshTick] = React.useState(0);
    React.useEffect(() => {
        const onVis = () => {
            if (document.visibilityState === "visible") {
                setRefreshTick((t) => t + 1);
            }
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    React.useEffect(() => setSlots(initialSlots), [initialSlots]);

    // каждые interval меняем ровно один слот (в том же месте)
    React.useEffect(() => {
        if (pool.length <= maxVisible || reduced) return;
        const id = window.setInterval(() => {
            setSlots((prev) => {
                const current = new Set(prev.map((s) => s.handle));
                const rest = pool.filter((m) => !current.has(m.handle));
                if (!rest.length) return prev;
                const i = Math.floor(Math.random() * prev.length);
                const next = [...prev];
                next[i] = rest[Math.floor(Math.random() * rest.length)];
                return next;
            });
        }, interval);
        return () => clearInterval(id);
    }, [pool, maxVisible, interval, reduced]);

    return (
        <MotionConfig reducedMotion={reduced ? "always" : "never"}>
            <section className="relative mx-auto max-w-7xl px-6 md:px-8 py-14 md:py-20">
                <motion.h2
                    variants={titleVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.6 }}
                    className="text-center font-[UnifrakturCook] text-3xl md:text-6xl leading-tight text-amber-100"
                >
                    {title}
                </motion.h2>

                <motion.div
                    variants={gridStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    className="mt-8 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                >
                    {Array.from({
                        length: Math.min(maxVisible, slots.length || maxVisible),
                    }).map((_, idx) => (
                        <Slot key={idx}>
                            <AnimatePresence mode="wait" initial={false}>
                                {slots[idx] && (
                                    <Card
                                        key={slots[idx].handle + "-" + refreshTick}
                                        m={slots[idx]}
                                        canHover={canHover}
                                    />
                                )}
                            </AnimatePresence>
                        </Slot>
                    ))}
                </motion.div>
            </section>
        </MotionConfig>
    );
}

/* ================= Slot keeps position/size (вход по скроллу) ================= */

function Slot({ children }: { children: React.ReactNode }) {
    const delay = React.useMemo(() => Math.random() * 0.15, []);
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
                filter: "blur(6px)" as any,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)" as any,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
            }}
            viewport={{ once: true, amount: 0.25 }}
            className="relative w-full"
        >
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                {children}
            </div>
        </motion.div>
    );
}

/* ================= Card (внутри слота) ================= */

function Card({ m, canHover }: { m: Member; canHover: boolean }) {
    const [idx, setIdx] = React.useState(0);
    const srcs = React.useMemo(() => srcChain(m.handle), [m.handle]);
    const [src, setSrc] = React.useState(srcs[0]);
    const [loaded, setLoaded] = React.useState(false);
    const [bust, setBust] = React.useState(0); // анти-кэш хвост

    React.useEffect(() => {
        setIdx(0);
        setSrc(srcs[0]);
        setLoaded(false);
        setBust(0);
    }, [srcs]);

    const nextSrc = React.useCallback(() => {
        if (idx < srcs.length - 1) {
            const n = idx + 1;
            setIdx(n);
            setSrc(srcs[n]);
            setLoaded(false);
        } else {
            setSrc(FALLBACK); // финальный fallback (поверх фонового такой же)
            setLoaded(true);
        }
    }, [idx, srcs]);

    const onErr = () => nextSrc();

    const onLoadChecked = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (!img.naturalWidth || !img.naturalHeight) {
            setBust((b) => b + 1); // перезапросим с ?v=
            return;
        }
        setLoaded(true);
    };

    // страхуемся: если вернулись на вкладку и не загрузилось — перезапросить
    React.useEffect(() => {
        const onVis = () => {
            if (document.visibilityState === "visible" && !loaded) {
                setBust((b) => b + 1);
            }
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [loaded]);

    // сторож: если долго нет onLoad — пробуем ещё раз
    React.useEffect(() => {
        if (loaded) return;
        const t = setTimeout(() => setBust((b) => b + 1), 4000);
        return () => clearTimeout(t);
    }, [src, loaded]);

    return (
        <motion.div
            {...cardEnter}
            className="absolute inset-0 group"
            whileHover={canHover ? { rotateZ: 2.5, y: -4, scale: 1.02 } : undefined}
            transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.8 }}
            style={{ filter: "drop-shadow(0 18px 40px rgba(0,0,0,.45))" }}
        >
            <a
                href={`https://x.com/${m.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open @${m.handle} on X`}
                className="block h-full w-full rounded-2xl overflow-hidden"
            >
                {/* @handle */}
                <div className="absolute left-3 top-3 z-10">
                    <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs text-amber-100">
                        @{m.handle}
                    </span>
                </div>

                {/* shine по диагонали (опционально) */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                    <span className="hm-shine block absolute -inset-1 opacity-0 group-hover:opacity-100" />
                </span>

                {/* СЛОИ: снизу fallback (виден сразу), сверху — реальная аватарка с плавным появлением */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    {/* fallback подложка */}
                    <img
                        src={FALLBACK}
                        alt="fallback"
                        className="h-full w-full object-cover rounded-2xl absolute inset-0"
                    />

                    {/* реальная аватарка */}
                    <motion.img
                        key={src + "?" + bust}
                        src={src + (bust ? `?v=${bust}` : "")}
                        onError={onErr}
                        onLoad={onLoadChecked}
                        alt={`@${m.handle}`}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        loading="eager"
                        fetchPriority={"high" as any}
                        decoding="async"
                        width={640}
                        height={640}
                        whileTap={!canHover ? { scale: 0.98 } : undefined}
                        whileHover={canHover ? { rotateZ: 9, scale: 1.16 } : undefined}
                        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.55 }}
                        className={[
                            "h-full w-full object-cover rounded-2xl absolute inset-0",
                            loaded ? "opacity-100" : "opacity-0",
                            "transition-opacity duration-500",
                            "will-change-transform transform-gpu",
                            // ч/б по умолчанию → цвет на hover
                            "grayscale group-hover:grayscale-0 transition-[filter] duration-300",
                        ].join(" ")}
                    />
                </div>
            </a>
        </motion.div>
    );
}
