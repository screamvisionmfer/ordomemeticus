import React, { useRef } from "react";
import { motion } from "framer-motion";

/**
 * ✠ Rite of Naming — EN only
 * Ceremonial rules for creating the next stained-glass relics.
 */

const cardEnter = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

type Tier = "Mythical" | "Legendary" | "Epic" | "Rare" | "Common";
const TIERS: Tier[] = ["Mythical", "Legendary", "Epic", "Rare", "Common"];

function RarityRow({ allowed }: { allowed: Tier[] }) {
    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {TIERS.map((t) => {
                const active = allowed.includes(t);
                return (
                    <span
                        key={t}
                        className={[
                            "inline-flex items-center rounded-full px-3 py-1 text-sm border",
                            active
                                ? "border-amber-500/40 text-amber-100 bg-black/30"
                                : "border-amber-500/20 text-amber-300/50 bg-black/20",
                        ].join(" ")}
                    >
                        {t}
                    </span>
                );
            })}
        </div>
    );
}

export default function CeremonialBlock() {
    // audio
    const saintRef = useRef<HTMLAudioElement | null>(null);
    const patronRef = useRef<HTMLAudioElement | null>(null);

    const playOnce = async (ref: React.RefObject<HTMLAudioElement>) => {
        const el = ref.current;
        if (!el) return;
        try {
            el.currentTime = 0;
            el.volume = 0.4;
            await el.play();
        } catch { }
    };
    const fadeStop = (ref: React.RefObject<HTMLAudioElement>, dur = 160) => {
        const el = ref.current;
        if (!el) return;
        const v0 = el.volume;
        const t0 = performance.now();
        const step = (ts: number) => {
            const p = Math.min((ts - t0) / dur, 1);
            el.volume = v0 * (1 - p);
            if (p < 1) requestAnimationFrame(step);
            else {
                el.pause();
                el.currentTime = 0;
                el.volume = v0;
            }
        };
        requestAnimationFrame(step);
    };

    return (
        <section
            aria-labelledby="ceremonial-title"
            className="relative mx-auto max-w-6xl px-6 md:px-8 py-10 md:py-16"
        >
            {/* preload hover SFX */}
            <audio ref={saintRef} src="/saintmaker.mp3" preload="auto" />
            <audio ref={patronRef} src="/patron.mp3" preload="auto" />

            <header className="mb-6 md:mb-8">
                <h2
                    id="ceremonial-title"
                    className="font-[UnifrakturCook] text-2xl md:text-4xl text-amber-200"
                >
                    ✠ Rite of Naming
                </h2>
                <p className="mt-3 text-base md:text-lg text-amber-100/85 leading-relaxed max-w-3xl">
                    A brief ordinance for holders on how the next saint is appointed and a new pane of holy glass is wrought.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* ==================== MYTHIC — TEAL/CYAN ==================== */}
                <motion.article
                    variants={cardEnter}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.35 }}
                    // ХОВЕР ЗДЕСЬ: подъём/наклон + теплая бирюзовая подсветка через drop-shadow (filter)
                    className="relative rounded-2xl transition-all duration-200 hover:-translate-y-1.5 hover:scale-[1.02] hover:rotate-[0.25deg] filter hover:drop-shadow-[0_0_60px_rgba(34,211,238,0.5)]"
                    onMouseEnter={() => playOnce(saintRef)}
                    onMouseLeave={() => fadeStop(saintRef)}
                >
                    {/* градиентный border с мягким переливом */}
                    <div
                        className="p-[2px] rounded-2xl"
                        style={{
                            background:
                                "linear-gradient(120deg, rgba(20,184,166,.95), rgba(34,211,238,.9), rgba(103,232,249,.85), rgba(20,184,166,.95))",
                            backgroundSize: "200% 200%",
                            animation: "ceremonyShift 10s ease-in-out infinite",
                        }}
                    >
                        {/* контентная панель — одинаковая высота */}
                        <div className="rounded-2xl bg-black/45 backdrop-blur-md ring-1 ring-cyan-300/35 p-6 md:p-8 min-h-[clamp(22rem,38vh,30rem)] flex flex-col">
                            <div className="mb-3">
                                <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-black/30 px-3 py-1 text-amber-200 text-sm">
                                    Mythic
                                </span>
                            </div>

                            <h3 className="font-[UnifrakturCook] text-2xl md:text-3xl text-amber-100">
                                Saintmaker’s Privilege
                            </h3>

                            <p className="mt-3 text-amber-100/85 leading-relaxed">
                                <span className="font-bold uppercase text-amber-100">Power:</span> commission a new stained-glass relic.
                            </p>

                            <RarityRow allowed={["Legendary", "Epic", "Rare", "Common"]} />

                            <div className="mt-4 space-y-3 text-amber-100/85 text-sm md:text-base">
                                <p>
                                    <span className="font-bold uppercase text-amber-100">Subject:</span> any character on demand —{" "}
                                    <em>you yourself</em>, or anyone you choose (from pilgrim to crowned lord).
                                </p>
                                <p>
                                    <span className="font-bold uppercase text-amber-100">Outcome:</span> one new relic is created at the
                                    chosen tier in the canonical style of the Order.
                                </p>
                            </div>

                            <div className="flex-1" />
                        </div>
                    </div>
                </motion.article>

                {/* ==================== LEGENDARY — GOLD ==================== */}
                <motion.article
                    variants={cardEnter}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.35 }}
                    className="relative rounded-2xl transition-all duration-200 hover:-translate-y-1.5 hover:scale-[1.02] hover:-rotate-[0.25deg] filter hover:drop-shadow-[0_0_60px_rgba(251,191,36,0.55)]"
                    onMouseEnter={() => playOnce(patronRef)}
                    onMouseLeave={() => fadeStop(patronRef)}
                >
                    <div
                        className="p-[2px] rounded-2xl"
                        style={{
                            background:
                                "linear-gradient(120deg, rgba(251,191,36,.95), rgba(245,158,11,.9), rgba(253,230,138,.85), rgba(251,191,36,.95))",
                            backgroundSize: "200% 200%",
                            animation: "ceremonyShift 10s ease-in-out infinite",
                        }}
                    >
                        <div className="rounded-2xl bg-black/45 backdrop-blur-md ring-1 ring-amber-400/40 p-6 md:p-8 min-h-[clamp(22rem,38vh,30rem)] flex flex-col">
                            <div className="mb-3">
                                <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-black/30 px-3 py-1 text-amber-200 text-sm">
                                    Legendary
                                </span>
                            </div>

                            <h3 className="font-[UnifrakturCook] text-2xl md:text-3xl text-amber-100">
                                Patron’s Privilege
                            </h3>

                            <p className="mt-3 text-amber-100/85 leading-relaxed">
                                <span className="font-bold uppercase text-amber-100">Power:</span> appoint the next relic’s tier and concept.
                            </p>

                            <RarityRow allowed={["Epic", "Rare", "Common"]} />

                            <div className="mt-4 space-y-3 text-amber-100/85 text-sm md:text-base">
                                <p>
                                    <span className="font-bold uppercase text-amber-100">Subject:</span> propose the character/theme; the
                                    Order interprets and finalizes.
                                </p>
                                <p>
                                    <span className="font-bold uppercase text-amber-100">Outcome:</span> one new relic will be produced at the
                                    chosen tier.
                                </p>
                            </div>

                            <div className="flex-1" />
                        </div>
                    </div>
                </motion.article>
            </div>

            {/* Contact block under the cards */}
            <div className="mt-8 md:mt-10 rounded-xl ring-1 ring-amber-500/20 bg-black/40 backdrop-blur-sm p-4 md:p-5">
                <p className="text-amber-100/85 leading-relaxed">
                    After receiving a <span className="text-amber-200">Mythic</span> or{" "}
                    <span className="text-amber-200">Legendary</span>, contact me and send proof of ownership, then tell which new
                    saint (you yourself or any character) you wish to immortalize in glass.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                        href="https://farcaster.xyz/screamvision"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-black/30 px-3 py-2 text-sm text-amber-100 hover:bg-amber-500/10 transition"
                    >
                        Farcaster
                    </a>
                    <a
                        href="https://x.com/scream_vision"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-black/30 px-3 py-2 text-sm text-amber-100 hover:bg-amber-500/10 transition"
                    >
                        X (Twitter)
                    </a>
                </div>
            </div>

            {/* keyframes for gentle border color shift */}
            <style>{`
        @keyframes ceremonyShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </section>
    );
}
