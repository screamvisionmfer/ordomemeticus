import React, { useEffect, useRef, useState } from "react";
import OrderStory from "./components/OrderStory";
import { motion, AnimatePresence } from "framer-motion";
import CeremonialBlock from "@/components/CeremonialBlock";
import OMHeaderPillIntegrated from "./components/OMHeaderPillIntegrated";


/** ============== Hero Background Rotator (full-width) ============== */
const RotatingHeroBG: React.FC = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    // 4x slower than default (16s per image)
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_IMAGES.length), 16000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="absolute inset-0 bg-cover bg-[40%_30%] grayscale"
          style={{ backgroundImage: `url(${HERO_IMAGES[idx]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 4.0, ease: "easeOut" }}
        />
      </AnimatePresence>
      {/* dark overlay and bottom gradient */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/85 via-black/50 to-transparent blur-xs" />
    </div>
  );
};

/** ====================== Config ====================== */
const PACK_URL = "https://vibemarket.com/market/ordo-memeticus?ref=B3FLA1AGGOH2";
const RARITY_ORDER = ["Mythical", "Legendary", "Epic", "Rare", "Common"] as const;
type Rarity = typeof RARITY_ORDER[number];
/** Background images for hero section (from /public/cards) */
const HERO_IMAGES = [
  "/cards/1.jpg","/cards/2.jpg","/cards/3.jpg","/cards/4.jpg","/cards/5.jpg","/cards/6.jpg","/cards/7.jpg",
  "/cards/8.jpg","/cards/9.jpg","/cards/10.jpg","/cards/11.jpg","/cards/12.jpg","/cards/13.jpg",
];


const rarityMeta: Record<Rarity, { hue: string; label: string; desc: string }> = {
  Mythical: { hue: "from-purple-900/70 via-fuchsia-900/60 to-indigo-900/70", label: "Mythical", desc: "Relics whispered only in forbidden rites." },
  Legendary: { hue: "from-red-900/70 via-amber-900/60 to-orange-900/70", label: "Legendary", desc: "Names carved into the cursed grimoire." },
  Epic: { hue: "from-emerald-900/70 via-teal-900/60 to-cyan-900/70", label: "Epic", desc: "Deeds sung beneath vaulted shadows." },
  Rare: { hue: "from-rose-900/70 via-pink-900/60 to-purple-900/70", label: "Rare", desc: "Faces seldom seen, often sworn in whispers." },
  Common: { hue: "from-zinc-800/70 via-zinc-900/60 to-black/70", label: "Common", desc: "Ordinary members of the Brotherhood, yet remembered by the chain." },
};

// Glow color under card on hover by rarity
const glowByRarity: Record<Rarity, string> = {
  Mythical: "bg-teal-400/35",
  Legendary: "bg-amber-400/45",
  Epic: "bg-fuchsia-400/40",
  Rare: "bg-sky-400/40",
  Common: "bg-zinc-100/25",
};

/** Mapping of card number -> audio filename (without path) */
const VOICE_MAP: Record<string, string> = {
  "1": "1-bobo.mp3",
  "2": "2-bankr.mp3",
  "3": "3-thosmur.mp3",
  "4": "4-seacasa.mp3",
  "5": "5-nico.mp3",
  "6": "6-beebs.mp3",
  "7": "7-jesse.mp3",
  "8": "8-mumu.mp3",
  "9": "9-jc.mp3",
  "10": "10-pepelady.mp3",
  "11": "11-pepemonk.mp3",
  "12": "12-jb.mp3",
  "13": "13-deployer.mp3",
};



const CARDS = [
  // 1 — Mythical
  {
    id: "om-1",
    name: "Bobo",
    role: "Bloody Infernal Lord",
    rarity: "Mythical" as Rarity,
    image: "/cards/1.jpg",
    blurbEN: "Upon thrones of ember he sitteth; chains sing in his grasp.",
    loreEN: "In cathedrals beneath the ash he was enthroned — not by prayer, but by fire. His gaze scorches scripture, his scepter brands the oath. All brethren whisper: 'Where Bobo walks, even shadows burn.",
    credits: "@bobocoineth"
  },

  // 2–3 — Legendary
  {
    id: "om-2",
    name: "Bankr Prophet",
    role: "Martyr of the Meme Order",
    rarity: "Legendary" as Rarity,
    image: "/cards/2.jpg",
    blurbEN: "To traders he is a savior, to fools — a curse. Yet all agree: Bankr is the prophet who turned signals into scripture.",
    loreEN: "Through his hollow screen the Order first learned the market’s tongue. His code whispered memes, his alerts birthed fortunes, his silence cost empires.",
    credits: "@bankrbot"
  },
  {
    id: "om-3",
    name: "Thosmur",
    role: "Vibe Imperator",
    rarity: "Legendary" as Rarity,
    image: "/cards/3.jpg",
    blurbEN: "Crowned in laurel and latency, he parades block by block.",
    loreEN: "He marches the forum of ledgers with banners of speed, each decree turns night into market. His steed is rumor, his sword a ticker. Scribes fear to miss his smile.",
    credits: "@thosmur"
  },

  // 4–5 — Epic
  {
    id: "om-4",
    name: "Seacasa",
    role: "Keeper of the Memetic World",
    rarity: "Epic" as Rarity,
    image: "/cards/4.jpg",
    blurbEN: "From his hands the first sparks fell as seeds; in silence they grew into memes everlasting.",
    loreEN: "He sowed the fertile ground with fragments of culture, each sprout a meme, each bloom a relic. To some he is gardener, to others prophet. But the Order remembers him as the father who planted eternity.",
    credits: "@seacasa"
  },
  {
    id: "om-5",
    name: "Nico",
    role: "Matron of Eternal Vibes",
    rarity: "Epic" as Rarity,
    image: "/cards/5.jpg",
    blurbEN: "She was among the few who shaped the current; the vibe eternal flows through her relic.",
    loreEN: "Whispers claim she holds the Original Meme, the pattern all others echo. Her silence is not empty — it is a folder yet unopened.",
    credits: "@hi_im_nico"
  },

  // 6–8 — Rare
  {
    id: "om-6",
    name: "Beebs",
    role: "Knight of the Eternal Moonlight",
    rarity: "Rare" as Rarity,
    image: "/cards/6.jpg",
    blurbEN: "To the Order she is not just knight, but light unbroken — the moon eternal in armor of vow.",
    loreEN: "Her blade gleams with lunar fire, her vow etched across the stars. She walks in silence where shadows gather, and none withstand her vigil.",
    credits: "@vibedotmarket"
  },
  {
    id: "om-7",
    name: "Sir Jesse",
    role: "Knight of the Base",
    rarity: "Rare" as Rarity,
    image: "/cards/7.jpg",
    blurbEN: "To the Order he is cornerstone and rampart alike: knight, builder, keeper of the path beneath our feet.",
    loreEN: "His blade was forged not for conquest, but for building. Stone by stone, block by block, he raised the citadel where the Order now dwells.",
    credits: "@jessepollak"
  },
  {
    id: "om-8",
    name: "Mumu",
    role: "Knight of the Bullish Dawn",
    rarity: "Rare" as Rarity,
    image: "/cards/8.jpg",
    blurbEN: "He is horn and sword, oath and verdict. His presence alone bends fear into faith, red into green.",
    loreEN: "The Order remembers him as more than knight — he is cycle itself, return eternal, market reborn.",
    credits: "@mumucoineth_"
  },

  // 9–13 — Common
  {
    id: "om-9",
    name: "JC",
    role: "Forge-Mage of the Vibe",
    rarity: "Rare" as Rarity,
    image: "/cards/9.jpg",
    blurbEN: "To the Order he is not only knight, but forge itself — the hand that shapes the unseen.",
    loreEN: "His oath is inked not on parchment, but in lines of code that burn with emerald fire. His sword hums with the logic of order, his cloak shields the sparks of creation.",
    credits: "@cryptojcdenton"
  },
  {
    id: "om-10",
    name: "Lady Pepe",
    role: "Taster of Garden Chalice",
    rarity: "Common" as Rarity,
    image: "/cards/10.jpg",
    blurbEN: "Where she sits, gardens bloom; where she walks, even silence tastes of wine.",
    loreEN: "She reigns not with iron, but with laughter poured in gold. Her cup brims with seasons, her smile crowns the feast.",
    credits: "@pepecoineth"
  },
  {
    id: "om-11",
    name: "Monk Pepe",
    role: "Keeper of the Little Flame",
    rarity: "Common" as Rarity,
    image: "/cards/11.jpg",
    blurbEN: "To the Order he is not master nor knight, but witness: the flame he carries is memory itself.",
    loreEN: "The corridors bend to his silence; the night follows his flame. In shadows he whispers prayers none recall, but all obey.",
    credits: "@pepecoineth"
  },
  {
    id: "om-12",
    name: "Cloudbed Fool",
    role: "Dreamer of Daylit Psalms",
    rarity: "Common" as Rarity,
    image: "/cards/12.jpg",
    blurbEN: "He wears no crown, yet rules every sunset. His law is ease, his verdict laughter.",
    loreEN: "Coins rise, empires fall — Jungle Bay just leans back, sipping eternity.",
    credits: "@JungleBayAC"
  },
  {
    id: "om-13",
    name: "OxDeployer",
    role: "Father of the Bankrbot",
    rarity: "Common" as Rarity,
    image: "/cards/13.jpg",
    blurbEN: "He forged no sword, but a machine of vision. Its screen became altar, its static became scripture.",
    loreEN: "When chains were silent, he struck the first deploy. From his hand uncoiled the bot that sees markets, memes, and men alike.",
    credits: "@0xDeployer"
  },
];



const groupByRarity = (cards: typeof CARDS) => {
  const map: Record<Rarity, typeof CARDS> = { Mythical: [], Legendary: [], Epic: [], Rare: [], Common: [] };
  cards.forEach(c => map[c.rarity].push(c));
  return map;
};

const Badge: React.FC<{ rarity: Rarity }> = ({ rarity }) => (
  <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-amber-500/30 bg-gradient-to-r ${rarityMeta[rarity].hue}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
    {rarityMeta[rarity].label}
  </div>
);

/** ============ Backdrop: stained glass + torch flicker ============ */
function GlazedBackdrop() {
  return (<><div className="ordo-glass" /><div className="ordo-torch" /></>);
}


/** ============ Global BG Audio (starts on CTA) ============ */
const BG_SRC = "/bg.mp3";
const TAVERN_SRC = "/tavern.mp3"; // from public/tavern.mp3 (root path)

const BgAudio: React.FC = () => {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const tavernRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setPlaying] = useState(false);

  // Effect #1: prepare and start on CTA/click, fade-in
  useEffect(() => {
    const music = musicRef.current;
    const tavern = tavernRef.current;
    if (!music || !tavern) return;

    // initial volumes & loop
    music.volume = 0.0;     // fade-in to ~0.15
    tavern.volume = 0.1;    // tavern ambience
    tavern.loop = true;
    music.loop = true;

    let started = false;

    async function start() {
      if (started) return;
      started = true;
      try {
        music.currentTime = 0;
        tavern.currentTime = 0;
        await tavern.play();
        await music.play();
        setPlaying(true);

        // fade-in bg music
        const target = 0.15;
        const dur = 1200;
        const t0 = performance.now();
        const v0 = music.volume;
        const step = (ts: number) => {
          const p = Math.min((ts - t0) / dur, 1);
          music.volume = v0 + (target - v0) * p;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      } catch {}
    }

    const onStart = () => start();
    const onClick = (e: any) => {
      const el = (e.target as HTMLElement);
      if (el?.closest?.('#ordostart')) start();
    };

    document.addEventListener("ordo:startAudio", onStart);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("ordo:startAudio", onStart);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // Effect #2: pause with fade-out when hidden, resume with fade-in when visible
  useEffect(() => {
    const music = musicRef.current;
    const tavern = tavernRef.current;
    if (!music || !tavern) return;
    let rafId: number | null = null;

    const fadeOutAndPause = () => {
      const vm0 = music.volume;
      const vt0 = tavern.volume;
      const t0 = performance.now();
      const DUR = 600;

      const step = (ts: number) => {
        const p = Math.min((ts - t0) / DUR, 1);
        music.volume = vm0 * (1 - p);
        tavern.volume = vt0 * (1 - p);
        if (p < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          music.pause();
          tavern.pause();
          setPlaying(false);
          // restore volumes for next start
          music.volume = vm0;
          tavern.volume = vt0;
        }
      };

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(step);
    };

    const resumeWithFadeIn = async () => {
      try {
        await tavern.play();
        await music.play();
        setPlaying(true);
        const vmTarget = 0.15;
        const vtTarget = 0.10;
        const t0 = performance.now();
        const DUR = 800;
        const vmStart = 0.0;
        const vtStart = 0.0;
        music.volume = vmStart;
        tavern.volume = vtStart;
        const step = (ts: number) => {
          const p = Math.min((ts - t0) / DUR, 1);
          music.volume = vmStart + (vmTarget - vmStart) * p;
          tavern.volume = vtStart + (vtTarget - vtStart) * p;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      } catch {}
    };

    const onVisibility = () => {
      if (document.hidden) fadeOutAndPause();
      else resumeWithFadeIn();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const toggle = async () => {
    const music = musicRef.current;
    const tavern = tavernRef.current;
    if (!music || !tavern) return;
    if (music.paused) {
      try {
        await tavern.play();
        await music.play();
        setPlaying(true);
      } catch {}
    } else {
      music.pause();
      tavern.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={musicRef} src={BG_SRC} preload="auto" />
      <audio ref={tavernRef} src={TAVERN_SRC} preload="auto" />
      <button
        onClick={toggle}
        className="fixed right-3 bottom-3 z-40 rounded-full bg-amber-600/80 text-black text-xs px-3 py-1 ring-1 ring-amber-400/60 hover:bg-amber-500/90"
      >
        {isPlaying ? "Pause Music" : "Play Music"}
      </button>
    </>
  );
};;
/** ====================== Intro ====================== */
const INTRO_LINES = [
  "Hear these words, ye who stand before the glass.",
  "For thou art not mere wanderer, but seeker of the hidden light.",
  "The Ordo Memeticus calleth thee.",
  "Within these windows lie not the faces of kings,",
  "But of brethren — saints and jesters, prophets and heretics, martyrs and villains.",
  "Each is truth, each is folly, each is bound eternal in glass and chain.",
];

const IntroScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);
  const [logoDock, setLogoDock] = useState(false);
  const begin = () => {
    setStarted(true);
    setTimeout(() => setLogoDock(true), 150);
    const v = voiceRef.current; if (v) { v.volume = 0.25; v.currentTime = 0; v.play().catch(() => { }); }
    document.dispatchEvent(new Event("ordo:startAudio"));
  };
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-amber-200 flex items-center justify-center">
      +   <IntroBackground />
      <audio ref={voiceRef} src="/Intro.mp3" preload="auto" />
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, top: "28%" }}
          animate={{ opacity: 1, top: started ? (logoDock ? "8%" : "28%") : "28%" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute left-1/2 -translate-x-1/2 font-[UnifrakturCook] text-3xl sm:text-4xl md:text-5xl tracking-wide"
        >ORDO MEMETICUS</motion.h1>

        {!started && (
          <div className="pt-80 flex flex-col items-center gap-6">
            <button id="ordostart" onClick={begin}
              className="btn-medieval is-gilded is-lg">
              Hear the Great Ones
            </button>
          </div>
        )}

        {started && (
          <motion.div className="pt-28 md:pt-40 flex flex-col items-center text-center"
            initial={{ opacity: 0 }} animate={{ opacity: logoDock ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}>
            <motion.div className="mt-6 md:mt-4 max-w-3xl text-md sm:text-base md:text-lg italic leading-snug md:leading-relaxed text-amber-100/90 space-y-3 md:space-y-3"
              initial="hidden" animate={logoDock ? "show" : "hidden"}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.25, delayChildren: 0.1 } } }}>
              {INTRO_LINES.map((line, i) => line === "" ? <div key={i} className="h-3" /> : (
                <motion.p key={i} variants={{ hidden: { opacity: 0, y: -10 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease: "easeOut" }}>{line}</motion.p>
              ))}
            </motion.div>
            <motion.button onClick={() => { begin(); onEnter(); }} initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: logoDock ? 1 : 0, y: logoDock ? 0 : 16 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              className="btn-medieval is-gilded is-lg mt-10 px-6 py-3">
              Enter the Cloister
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
/** ============== Intro Background Rotator ============== */
const IntroBackground: React.FC = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_IMAGES.length), 20000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="absolute inset-0 bg-cover bg-[50%_30%] grayscale"
          style={{ backgroundImage: `url(${HERO_IMAGES[idx]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 5.0, ease: "easeOut" }}
        />
      </AnimatePresence>

      {/* мощное общее затемнение */}
      <div className="absolute inset-0 bg-black/40" />

      {/* овальная виньетка с размытием */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full bg-black/80 blur-2xl"
          style={{
            maskImage: "radial-gradient(circle, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 100%)",
            WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 100%)",
          }}
        />
      </div>
    </div>
  );
};



/** ============ Tile3D (suspended plate) ============ */
type Tile3DProps = { className?: string; children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; };
function Tile3D({ className = "", children, onClick, style }: Tile3DProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [s, setS] = useState({ rx: 0, ry: 0, tz: 0, ox: 50, oy: 50, elev: 0 });
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const px = (x / r.width) * 100, py = (y / r.height) * 100;
    const ry = ((x - r.width / 2) / r.width) * 20;
    const rx = -((y - r.height / 2) / r.height) * 20;
    const dist = Math.hypot(px - 50, py - 50);
    const tz = -Math.min(10, dist / 1.8);
    setS({ rx, ry, tz, ox: px, oy: py, elev: 1 });
  };
  const onLeave = () => setS({ rx: 0, ry: 0, tz: 0, ox: 50, oy: 50, elev: 0 });
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      data-elev={s.elev}
      className={`tile3d ordocursor ${className}`}
      style={{ ...style, transform: `perspective(1200px) rotateX(${s.rx}deg) rotateY(${s.ry}deg) translateZ(${s.tz}px)`, ["--ox" as any]: `${s.ox}%`, ["--oy" as any]: `${s.oy}%` }}>
      <div className="tile3d-glint" />
      {children}
    </div>
  );
}

/** ====================== Card ====================== */
function GlassCard({ card, onOpen }: { card: any; onOpen: (c: any) => void }) {
  return (
    <Tile3D
      onClick={() => onOpen(card)}
      className="card-equal card-scale-90 group relative overflow-visible rounded-2xl bg-black/60 ring-1 ring-amber-500/20 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,200,0,0.08)]"
    >

      {/* Контент карточки */}
      <div className="light-sweep relative grid grid-cols-1 md:grid-cols-5 card-root">
        <div className="md:col-span-2">
          <div className="relative overflow-hidden rounded-l-2xl md:rounded-l-2xl md:rounded-r-none">
            <div className="relative media-center-on-mobile-landscape">
              <img
                src={card.image}
                alt={card.name}
                className="card-media h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100"></div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 p-5 md:p-7 flex flex-col gap-4 card-body">
          <div className="show-on-mobile-landscape mb-1"><Badge rarity={card.rarity} /></div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-amber-100/90">
              {card.name}
            </h3>
            <div className="hide-on-mobile-landscape"><Badge rarity={card.rarity} /></div>
          </div>

          <p className="text-amber-200/60 text-sm md:text-base italic">
            {card.role}
          </p>
          <p className="text-amber-100/90 text-sm md:text-base">
            {card.blurbEN}
          </p>
        </div>

      </div>
    </Tile3D>
  );
}


/** ====================== Lightbox ====================== */
function Lightbox({ card, onClose, onPrev, onNext, autoplayToken }: { card: any, onClose: () => void, onPrev: () => void, onNext: () => void, autoplayToken?: number }) {
  // --- Audio narration for each card ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false); // becomes true after user clicks inside the lightbox
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [playToken, setPlayToken] = useState(0); // trigger replays on card change

  // lock page scroll while lightbox open
  useEffect(() => { const el = document.documentElement; const prev = el.style.overflow; el.style.overflow = 'hidden'; return () => { el.style.overflow = prev || ''; }; }, []);

  // Build audio src by matching number from card.image or id
  const numFromImage = (() => {
    const m = (card?.image || '').match(/\/([0-9]+)\./);
    if (m) return m[1];
    const m2 = (card?.id || '').match(/om-(\d+)/);
    return m2 ? m2[1] : null;
  })();
  // строим путь к аудио на основе номера карточки и карты VOICE_MAP
  const audioSrc = numFromImage ? `/chars/${numFromImage}.mp3` : undefined;



  // Auto-enable and play immediately when opened from a card click
  useEffect(() => {
    if (autoplayToken == null) return;
    setAudioReady(true);
    setNarrationEnabled(true);
    setPlayToken(x => x + 1);
  }, [autoplayToken]);
  // When card changes (or navigation), schedule audio after 1s if allowed
  useEffect(() => {
    if (!audioReady || !narrationEnabled) return;
    const t = setTimeout(() => {
      const el = audioRef.current;
      if (!el) return;
      try { el.currentTime = 0; el.play().catch(() => { }); } catch (e) { }
    }, 1000);
    return () => clearTimeout(t);
  }, [card?.id, playToken, audioReady, narrationEnabled]);

  // Restart audio when user navigates
  useEffect(() => {
    // pause on unmount
    return () => { try { audioRef.current?.pause(); } catch (e) { } };
  }, []);

  const handleLightboxActivate = () => {
    if (!audioReady) setAudioReady(true);
    // trigger a replay
    setPlayToken(x => x + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') onPrev(); if (e.key === 'ArrowRight') onNext(); };
    document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <button onClick={onPrev} className="w-12 h-12 md:w-10 md:h-10 absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full ring-1 ring-amber-500/30 bg-zinc-900/70 hover:bg-zinc-900/60 text-amber-200 transition transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 hover:ring-2 hover:ring-amber-300/40">‹</button>
      <button onClick={onNext} className="w-12 h-12 md:w-10 md:h-10 absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full ring-1 ring-amber-500/30 bg-zinc-900/70 hover:bg-zinc-900/60 text-amber-200 transition transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 hover:ring-2 hover:ring-amber-300/40">›</button>
      <button onClick={onClose} className="w-12 h-12 md:w-10 md:h-10 absolute top-6 right-6 z-50 rounded-full w-10 h-10 flex items-center justify-center ring-1 ring-amber-500/30 bg-zinc-900/80 hover:bg-zinc-900/60 text-amber-200 font-bold transition transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 hover:ring-2 hover:ring-amber-300/40">×</button>
      {/* narration audio element */}
      <audio ref={audioRef} preload="auto" src={audioSrc} key={audioSrc}
        onTimeUpdate={() => { const el = audioRef.current; if (!el) return; setCur(el.currentTime); setDur(el.duration || 0); if (el.duration > 0) setProgress(el.currentTime / el.duration); }}
        onLoadedMetadata={() => { const el = audioRef.current; if (!el) return; setDur(el.duration || 0); }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={handleLightboxActivate}>
        <AnimatePresence mode="popLayout">
          <motion.div key={card.id}
            initial={{ opacity: 0, x: 40, scale: .98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: .98 }}
            transition={{ duration: .35, ease: "easeOut" }}>
            <Tile3D className="light-sweep group relative w-full max-w-6xl max-h-[100dvh] md:max-h-[90vh] overflow-hidden rounded-2xl bg-black/70 ring-1 ring-amber-500/30 backdrop-blur-xl">
              <div className={`pointer-events-none absolute -inset-1 opacity-25 blur-2xl bg-gradient-to-br ${rarityMeta[card.rarity].hue}`} />
              <div className="relative grid grid-cols-1 md:grid-cols-5 card-root">
                {/* левая колонка = flex, центрируем по X/Y */}
                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-l-2xl md:rounded-l-2xl md:rounded-r-none p-2">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="block w-auto object-contain max-h-[50vh] md:max-h-[70vh]" // убрал mt-4 и h-auto
                    />
                    <div className="pointer-events-none absolute inset-0" />
                  </div>
                </div>

                <div className="md:col-span-3 p-6 md:p-8 flex flex-col gap-4">
                  <div className="show-on-mobile-landscape mb-1"><Badge rarity={card.rarity} /></div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl sm:text-2xl md:text-5xl font-extrabold tracking-tight text-amber-100 font-[UnifrakturCook]">
                        {card.name}
                      </h3>

                      <button aria-label="Toggle narration"
                        onClick={(e) => { e.stopPropagation(); setNarrationEnabled(x => { const nx = !x; if (nx && audioReady) { setPlayToken(v => v + 1); } else { try { audioRef.current?.pause() } catch (e) { } } return nx; }); }}
                        className="h-8 w-8 grid place-items-center rounded-full bg-black/40 text-amber-200 ring-1 ring-amber-400/40 hover:ring-2 hover:ring-amber-300/50">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                          {narrationEnabled ? (
                            <path d="M3 9h4l5-5v16l-5-5H3V9zm12.5 3a3.5 3.5 0 0 0-1.7-3.02v6.04A3.5 3.5 0 0 0 15.5 12zm0-7a7 7 0 0 1 0 14v-2a5 5 0 0 0 0-10V5z" />
                          ) : (
                            <path d="M3 9h4l5-5v16l-5-5H3V9zm15.8 7.4-1.4 1.4L14.6 15l-1.6-1.6L11 11.4 9.6 10l-3-3 1.4-1.4 12.8 12.8z" />
                          )}
                        </svg>
                      </button>
                    </div>
                    <div className="hide-on-mobile-landscape"><Badge rarity={card.rarity} /></div>
                  </div>
                  <p className="text-amber-200/60 text-base md:text-lg italic">{card.role}</p>
                  <p className="text-amber-100/80 text-xs md:text-lg">{card.blurbEN}</p>

                  <div className="hidden sm:block hide-on-mobile-landscape text-amber-100/80 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {card.loreEN}
                  </div>
                  {/* inline narration progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-amber-200/60 text-xs mb-1">
                      <span>Narration</span>
                      <span>{new Date(cur * 1000).toISOString().substring(14, 19)} / {dur ? new Date(dur * 1000).toISOString().substring(14, 19) : "00:00"}</span>
                    </div>
                    <div
                      role="progressbar" aria-label="Seek narration" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100) || 0}
                      onClick={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        const rect = el.getBoundingClientRect();
                        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                        try {
                          if (audioRef.current && dur > 0) { audioRef.current.currentTime = ratio * dur; setProgress(ratio); }
                        } catch (e) { }
                      }}
                      className="h-[6px] w-full rounded-full bg-amber-200/20 overflow-hidden cursor-pointer ring-1 ring-amber-400/20">
                      <div className="h-full bg-amber-300/70" style={{ width: `${(progress * 100) || 0}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    {card.credits && (
                      <div className="min-w-0 max-w-[60%] truncate text-amber-200/80 text-xs sm:text-sm">{card.credits}</div>
                    )}
                    <a
                      href={PACK_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 ml-auto inline-flex items-center whitespace-nowrap gap-2
             px-4 py-2 rounded-xl
             bg-zinc-900/40 text-amber-200
             ring-1 ring-amber-400/30
             transition duration-300 ease-out
             hover:bg-zinc-900/60 hover:ring-amber-300/60
             hover:shadow-[0_0_18px_4px_rgba(251,191,36,0.35)]
             focus:outline-none focus:ring-2 focus:ring-amber-300/70"
                    >
                      Collect this Relic
                    </a>

                  </div>
                </div>
              </div>

              {/* Narration progress bar */}

            </Tile3D>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** ====================== Page ====================== */
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [filter, setFilter] = useState<Rarity | "All">("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [autoplayToken, setAutoplayToken] = useState(0);

  const list = filter === "All" ? CARDS : CARDS.filter(c => c.rarity === filter);
  const grouped = groupByRarity(list);

  return (
    <div className="min-h-screen bg-[#060608] text-amber-100 font-serif">
      <GlazedBackdrop />
      <BgAudio />
      <> </>
      <AnimatePresence initial={false}>
        {!showIntro && (
          <motion.div
            key="header"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <OMHeaderPillIntegrated />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {showIntro ? (
          <IntroScreen key="intro" onEnter={() => setShowIntro(false)} />
        ) : (
          <motion.main key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>


            <div className="relative isolate w-full overflow-hidden">
            <RotatingHeroBG />
                <section className="relative z-10 w-full min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-amber-200 font-[UnifrakturCook]">The Ordo Memeticus</h1>
                  <p className="mt-6 text-lg md:text-xl text-amber-100/90 italic max-w-3xl">"In glass and chain our brethren endure — saints and sinners, martyrs and jesters, villains crowned in shame. Take a relic, and be bound to the brotherhood eternal."</p>
              <div className="mt-10 flex justify-center gap-4">
                  <a href={PACK_URL} target="_blank" rel="noreferrer" className="btn-medieval is-gilded is-sm mt-15 px-6 py-3 rounded-xl px-6 py-3">Collect the Relics</a>
                <button className="rounded-xl px-6 py-3 font-semibold bg-zinc-900/70 ring-1 ring-amber-500/30 hover:bg-zinc-900/90 text-amber-200" onClick={() => document.getElementById('relics')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>View Relics</button>
              </div>
            </section>
            </div>

              <section id="order-story"><OrderStory/></section>
              <CeremonialBlock />

            <section id="relics" className="relative mx-auto max-w-6xl px-4 pb-24">
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-amber-100 font-[UnifrakturCook]">Relics of the Dark Brotherhood</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {(["All", ...RARITY_ORDER] as Array<"All" | Rarity>).map((r) => (
                    <button key={r} onClick={() => setFilter(r)}
                      className={`px-3 py-1.5 rounded-full text-sm ring-1 ring-amber-500/30 transition ${filter === r ? "bg-amber-600/30 text-amber-100" : "bg-zinc-900/60 text-amber-200/70 hover:bg-zinc-900/80"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {RARITY_ORDER.filter(r => filter === "All" || r === filter).map((rarity) => (
                <div key={rarity} className="space-y-6 mb-12">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold text-amber-100/90">{rarityMeta[rarity].label}</h3>
                      <p className="text-sm text-amber-200/60">{rarityMeta[rarity].desc}</p>
                    </div>
                    <div className={`hidden md:block h-px w-1/2 bg-gradient-to-r ${rarityMeta[rarity].hue}`} />
                  </div>
                  <motion.div className="cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
                    initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                    {grouped[rarity].map((card) => (
                      <motion.div key={card.id} variants={{ hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } } }}>
                        <GlassCard card={card} onOpen={(c) => { setLightboxIndex(list.findIndex(x => x.id === c.id)); setAutoplayToken(t => t + 1); }} /></motion.div>
                    ))}</motion.div>
                </div>
              ))}
            </section>

            {lightboxIndex !== null && (
              <Lightbox
                card={list[lightboxIndex]}
                autoplayToken={autoplayToken}
                onClose={() => setLightboxIndex(null)}
                onPrev={() => setLightboxIndex((i) => {
                  const L = list.length; if (i == null) return 0; return (i - 1 + L) % L;
                })}
                onNext={() => setLightboxIndex((i) => {
                  const L = list.length; if (i == null) return 0; return (i + 1) % L;
                })}
              />
            )}

            <footer className="relative border-t border-amber-500/20 bg-black/80">
              <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="text-amber-200/80 text-sm rounded-md ring-1 ring-amber-500/30 px-3 py-2 bg-black/20">Created by <a href="https://x.com/scream_vision" target="_blank" rel="noreferrer" className="underline decoration-amber-400/60 hover:decoration-amber-300 hover:text-amber-100">Scream.Vision</a></div>

                <div className="space-y-2">
                  <div className="text-amber-200 font-semibold tracking-wide font-[UnifrakturCook]">ORDO MEMETICUS</div>
                  <p className="text-amber-200/60 text-sm max-w-xl">
                    All faces are remembered — heroes, fools, martyrs, and villains. Raise not stone nor parchment, but glass and chain. <em>In tenebris, lumen.</em>
                  </p>
                </div>
                  <a href={PACK_URL} target="_blank" rel="noreferrer" className="btn-medieval is-gilded is-lg mt-10 px-6 py-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm">Enter the Cloister</a>
              </div>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
