import { useMemo, useState, useRef, useEffect } from "react";

import ShareImageComposer from "@/components/ShareImageComposer";

/* =========================== CONFIG =========================== */
const SITE_URL = "https://ordomemeticus.lol/";
const SITE_URL_OPEN = SITE_URL + "#rituale";
const MARKET_URL = "https://vibechain.com/market/ordo-memeticus";
const PACK_NAME = "ORDO MEMETICUS";
const CORE_TICKER = "$ORDEN";

const MEME_TICKERS = [
    "$TOWELIE", "$BRAINLET", "$JBM", "$SOY", "$ORDEN", "$MUMU", "$PEPE",
    "$BANKR", "$DRB", "$IKTFB", "$PARK",
] as const;

/* ======================= SLOTS BY GENDER ====================== */
const GREET_M = ["Frater", "Brother", "Dominus", "Sir", "Lord"] as const;
const GREET_F = ["Soror", "Sister", "Domina", "Dame", "Lady"] as const;

const HONOR_M = [
    "Novice", "Acolyte", "Knight", "Templar", "Paladin", "Inquisitor", "Heretic", "Warden", "Ranger", "Scribe", "Abbot",
    "Marshal", "Herald", "Keeper", "Guardian", "Watchman", "Bannerlord", "High Knight", "Prince", "King", "Baron", "Duke",
    "Torchbearer", "Bellringer", "Archknight", "Storm-Templar", "Sigil-Bearer",
] as const;
const HONOR_F = [
    "Novice", "Acolyte", "Knight", "Templaress", "Paladina", "Inquisitrix", "Heretic", "Warden", "Ranger", "Scribe", "Abbess",
    "Marshal", "Herald", "Keeper", "Guardian", "Watchwoman", "Bannermaiden", "High Dame", "Princess", "Queen", "Baroness", "Duchess",
    "Torchbearer", "Bellringer", "Archdame", "Storm-Templaress", "Sigil-Bearer",
] as const;

const ROLE = [
    "Keeper", "Custodian", "Herald", "Seer", "Seeress", "Oracle", "Watcher", "Curator", "Chronicler", "Cartographer",
    "Caller of Meme Raids", "Bellringer of Green Candles", "Torchbearer", "Standard-Bearer", "Banner of the Pump",
    "Keeper of Seed Phrases", "Guardian of Cold Wallets", "Warden of Floor Price", "Harvester of Airdrops",
    "Oracle of Green Candles", "Sealer of Multisigs", "Herald of Onchain Summer", "Grail Seeker",
    "Curator of Sacred JPEGs", "Caller of Raidcasts", "Invoker of Based Times", "Archivist of Rug Alerts",
] as const;

const OF_PARTS = [
    "Onchain Summer", "Meme Magic", "Sacred JPEGs", "DeFi Cloisters", "Airdrop Season", "GM Scriptures", "WAGMI Prophecy", "Based Times",
    "Grail Wallets", "Pump Rituals", "Far Lands (L2)", "MEV Winds", "Gas Altars", "Candlelit Charts", "RUG Chronicles", "Normie Tears",
    "Warpcast Choir", "Base Marches", "Copium Choir", "Depeg Myths", "Slippage Oracles", "Multisig Watch", "Aether Scan", "JPEGorum",
    "Dune Tablets", "Seed Sigils", "Onchain Relics", "Floor Vigil", "Mint Flames", "Bullrun Bells", "ATH Heralds", "Rekt Abbey",
    "Meme Treasury", "Pump Canticles", "Eternal GM", "Diamond Vows", "Lambo Dreams", "Watchtowers", "Candle Rooms", "Rugpull Catacombs",
    "Lost Keys", "LP Cauldrons", "Perp Eternal", "Liquid Staking", "ZK Sigils", "OP Citadels", "L2 Marches", "Finality",
    "Quantum Shitposts", "JPEG Cathedrals", "Raid Scrolls", "Memetic Crusades", "Hashrate Hymns", "Bridge Watch", "Oracle Feeds",
    "Copium Fountains", "Exit Liquidity Marshes", "Ath Bells", "Bonding Curves", "Liquidity Graves", "Onchain Liturgies",
    "Pump Psalms", "Dank Spellbooks", "Szn of Airdrops", "Farcaster Choirs", "X Altar", "DeFi Abbey", "Gasless Miracles",
] as const;

const RELICS = [
    "Onchain Relics", "Seed Sigils", "Dune Tablets", "Sacred JPEGs", "Grail Wallets", "Floor Vigils", "Mint Flames", "MEV Winds",
] as const;

const EPITHET = [
    "the Based", "the Unrugged", "the Diamond-Handed", "the Gas-Pardoned", "the Meme-Baptized", "the Rekt", "the Invictus", "the Watchful",
    "the Grailbound", "the Memetic", "the Candlelit", "the Unbroken", "the Unfudgable", "the Rug-Resistant", "the Candle-Blessed",
    "the Seed-Keeper", "the Raidcaller", "the Grail-Hunting",
] as const;

/* ============================ UTILS =========================== */
function openPopup(url: string) {
    const w = 680, h = 560;
    const left = (window.screenX ?? 0) + ((window.outerWidth ?? 0) - w) / 2;
    const top = (window.screenY ?? 0) + ((window.outerHeight ?? 0) - h) / 2;
    window.open(url, "_blank", `width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`);
}

function latinizeName(raw: string) {
    return raw
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .replace(/(.)\1+/g, "$1")
        .slice(0, 24);
}

function hashString(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

const mod = (n: number, m: number) => ((n % m) + m) % m;
function pick<T>(arr: readonly T[], seed: number, salt = 0) {
    return arr[mod(seed + salt, arr.length)];
}

/* ========================= TEMPLATES ========================== */
const LINKERS = ["of", "from", "of the", "under the Sigil of", "over the", "within the"] as const;
const TEMPLATES: string[] = [
    "{GREET} {NAME}, {HONOR} {LINK} {OF}",
    "{GREET} {NAME}, {HONOR} of {TICK}",
    "{GREET} {NAME}, Keeper of Seed Phrases",
    "{GREET} {NAME}, {ROLE} of {OF} & Apostle of {TICK}",
    "{ROLE} {NAME}, {EPITHET}",
    "{GREET} {NAME}, Invoker of Based Times",
    "{GREET} {NAME}, Archivist of Rug Alerts",
];

/* ========================== BUILD TITLE ======================= */
function makeTitle(rawName: string, gender: "Frater" | "Soror", variant: number) {
    const seed = hashString(rawName + "|" + gender);
    const NAME = latinizeName(rawName);

    const GREET = pick(gender === "Frater" ? GREET_M : GREET_F, seed >>> 1, variant * 3);
    const HONOR = pick(gender === "Frater" ? HONOR_M : HONOR_F, seed >>> 2, variant * 5);
    const ROLEv = pick(ROLE, seed >>> 3, variant * 7);
    const OF = pick(OF_PARTS, seed >>> 4, variant * 11);
    const REL = pick(RELICS, seed >>> 5, variant * 13);
    const EP = pick(EPITHET, seed >>> 6, variant * 17);
    const TICK = pick(MEME_TICKERS, seed >>> 7, variant * 19);
    const LINK = pick(LINKERS, seed >>> 8, variant * 23);
    const tpl = pick(TEMPLATES, seed >>> 9, variant * 29);

    const title = tpl
        .replaceAll("{GREET}", GREET)
        .replaceAll("{HONOR}", HONOR)
        .replaceAll("{NAME}", NAME)
        .replaceAll("{ROLE}", ROLEv)
        .replaceAll("{OF}", OF)
        .replaceAll("{REL}", REL)
        .replaceAll("{EPITHET}", EP)
        .replaceAll("{TICK}", TICK)
        .replaceAll("{LINK}", LINK);

    return title.replace(/\s+/g, " ").trim();
}

/* ========================= SHARING ======================= */
function buildShareMultiline(title: string, platform: "x" | "farcaster") {
    const handle = platform === "x" ? "@scream_vision" : "@screamvision";
    return [
        `✠  I was anointed as ${title}`,
        `in ${PACK_NAME} ${CORE_TICKER} ✠ `,
        ``,
        `Buy the pack: ${MARKET_URL}`,
        ``,
        `Collection by ${handle}`,
        ``,
        `Claim Your Name: ${SITE_URL_OPEN}`
    ].join("\n");
}
const shareX = (t: string) => openPopup("https://twitter.com/intent/tweet?text=" + encodeURIComponent(buildShareMultiline(t, "x")));
const shareFC = (t: string) => openPopup("https://warpcast.com/~/compose?text=" + encodeURIComponent(buildShareMultiline(t, "farcaster")));

/* ============================== UI ============================ */

export default function RitualTitleGenerator() {
    const [gender, setGender] = useState<"Frater" | "Soror">("Frater");
    const [name, setName] = useState("");
    const [variant, setVariant] = useState(0);
    const nameSndRef = useRef<HTMLAudioElement | null>(null);
    const composerRef = useRef<ShareImageComposerHandle | null>(null);
    const [tipVisible, setTipVisible] = useState(false);
    const [tipXY, setTipXY] = useState<{x:number,y:number}>({x:0,y:0});
    const tipText = (
        <>
            <div className="font-semibold">After click, the title image is copied</div>
            <div className="text-xs opacity-80">Paste with Ctrl+V / Cmd+V</div>
        </>
    );
    const showTip = (e: any) => { setTipVisible(true); setTipXY({x: e.clientX + 14, y: e.clientY + 18}); };
    const moveTip = (e: any) => { if (tipVisible) setTipXY({x: e.clientX + 14, y: e.clientY + 18}); };
    const hideTip = () => setTipVisible(false);


    const playNameSnd = () => { try { if (!nameSndRef.current) return; nameSndRef.current.currentTime = 0; nameSndRef.current.volume = 0.5; void nameSndRef.current.play(); } catch { } };

    const hasName = name.trim().length > 0;
    const title = useMemo(() => (hasName ? makeTitle(name, gender, variant) : ""), [name, gender, variant, hasName]);

    
    // Debounced title for image generation to avoid rapid re-draw artifacts while typing
    const [debouncedTitle, setDebouncedTitle] = useState<string>("");
    useEffect(() => {
      const t = setTimeout(() => setDebouncedTitle(title), 1000);
      return () => clearTimeout(t);
    }, [title]);
async function shareWithCopy(platform: "x" | "farcaster") {
        // ensure latest canvas before sharing
        await composerRef.current?.redraw();
        // copy PNG to clipboard (if supported)
        await composerRef.current?.copyImage();
        // open composer window with prefilled text
        const text = buildShareMultiline(title, platform);
        const url = platform === "x"
            ? "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text)
            : "https://warpcast.com/~/compose?text=" + encodeURIComponent(text);
        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <div className="mx-auto max-w-3xl">
            <audio ref={nameSndRef} src="/yourname.mp3" preload="auto" />

            {/* input + toggle */}
            <div className="grid gap-3 md:grid-cols-[1fr,240px]">
                <input
                    value={name}
                    onFocus={playNameSnd}
                    onChange={(e) => (setVariant(0), setName(e.target.value))}
                    placeholder="Write your name, stranger…"
                    className="input-arcane w-full"
                />
                <div className="toggle-rite" data-side={gender === "Soror" ? "R" : "L"}>
                    <div className="thumb" />
                    <button onClick={() => (setVariant(0), setGender("Frater"))} className={gender === "Frater" ? "active" : ""}>Frater</button>
                    <button onClick={() => (setVariant(0), setGender("Soror"))} className={gender === "Soror" ? "active" : ""}>Soror</button>
                </div>
            </div>

            {/* reroll */}
            <div className="mt-4">
                <button disabled={!hasName} onClick={() => setVariant(v => v + 1)} className="btn-medieval is-gilded is-sm w-full">
                    ✨ REROLL
                </button>
            </div>

            {/* result */}
            <div className="mt-6 text-center">
                {title && (
                    <>
                        <div className="text-2xl md:text-3xl font-[UnifrakturCook] text-amber-200 drop-shadow">{title}</div>

                        {/* row: equal buttons */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button onClick={() => shareWithCopy("x")} onMouseEnter={showTip} onMouseMove={moveTip} onMouseLeave={hideTip} className="btn-ordo w-full">✖ Share on X</button>
                            <button onClick={() => shareWithCopy("farcaster")} onMouseEnter={showTip} onMouseMove={moveTip} onMouseLeave={hideTip} className="btn-ordo w-full">𝔉 Share on Farcaster</button>
                        </div>

                        {/* secondary row: download/copy only */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button onClick={async () => { await composerRef.current?.redraw(); composerRef.current?.downloadPNG(); }} className="btn-ordo w-full">⬇ Download PNG</button>
                            <button onClick={async () => { await composerRef.current?.redraw(); await composerRef.current?.copyImage(); }} className="btn-ordo w-full">📋 Copy Image</button>
                        </div>

                        {/* Desktop preview under buttons */}
                        <div className="mt-2 hidden md:block">
                          <ShareImageComposer ref={composerRef} title={debouncedTitle} cornerSrc="/corner_tile.png" sideSrc="/side_tile.png" compact={false} />
                        </div>

                        {/* невидимый рендер PNG */}
                        <ShareImageComposer ref={composerRef} title={debouncedTitle} cornerSrc="/corner_tile.png" sideSrc="/side_tile.png" compact />
                    </>
                )}
            
            {tipVisible && (
              <div
                className="fixed z-[200] pointer-events-none px-3 py-2 text-sm rounded-md bg-stone-900/95 text-amber-100 ring-1 ring-amber-500/30 shadow-lg"
                style={{ left: tipXY.x, top: tipXY.y, transform: "translateY(-4px)" }}
              >
                {tipText}
              </div>
            )}
        </div>
        </div>
    );
}

