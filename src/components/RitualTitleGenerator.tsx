import { useMemo, useState, useRef, useEffect } from "react";
import ShareImageComposer, { ShareImageComposerHandle } from "@/components/ShareImageComposer";

/* =========================== CONFIG =========================== */
const SITE_URL = "https://ordomemeticus.lol/";
const SITE_URL_OPEN = SITE_URL + "#rituale";
const MARKET_URL = "https://vibechain.com/market/ordo-memeticus";
const PACK_NAME = "ORDO MEMETICUS";
const CORE_TICKER = "$ORDEN";

/* Если у тебя уже есть эти утилиты в проекте — можешь удалить мои версии ниже */
function openPopup(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
}
function latinizeName(s: string) {
    // лёгкая защита от пустого ввода
    const x = (s || "").trim();
    return x.length ? x : "Anon";
}

const MEME_TICKERS = [
    "$TOWELIE",
    "$BRAINLET",
    "$JBM",
    "$SOY",
    "$ORDEN",
    "$MUMU",
    "$PEPE",
    "$BNKR",
    "$DRB",
    "$IKTFB",
    "$PARK",
] as const;

/* ======================= SLOTS BY GENDER ====================== */
const GREET_M = ["Frater", "Brother", "Dominus", "Sir", "Lord"] as const;
const GREET_F = ["Soror", "Sister", "Domina", "Dame", "Lady"] as const;

const HONOR_M = [
    "Novice",
    "Acolyte",
    "Knight",
    "Templar",
    "Paladin",
    "Inquisitor",
    "Heretic",
    "Warden",
    "Ranger",
    "Scribe",
    "Abbot",
    "Marshal",
    "Herald",
    "Keeper",
    "Guardian",
    "Watchman",
    "Bannerlord",
    "High Knight",
    "Prince",
    "King",
    "Baron",
    "Duke",
    "Torchbearer",
    "Bellringer",
    "Archknight",
    "Storm-Templar",
    "Sigil-Bearer",
] as const;

const HONOR_F = [
    "Novice",
    "Acolyte",
    "Knight",
    "Templaress",
    "Paladina",
    "Inquisitrix",
    "Heretic",
    "Warden",
    "Ranger",
    "Scribe",
    "Abbess",
    "Marshal",
    "Herald",
    "Keeper",
    "Guardian",
    "Watchwoman",
    "Bannermaiden",
    "High Dame",
    "Princess",
    "Queen",
    "Baroness",
    "Duchess",
    "Torchbearer",
    "Bellringer",
    "Archdame",
    "Storm-Templaress",
    "Sigil-Bearer",
] as const;

const ROLE = [
    "Keeper",
    "Custodian",
    "Herald",
    "Seer",
    "Seeress",
    "Oracle",
    "Watcher",
    "Curator",
    "Chronicler",
    "Cartographer",
    "Caller of Meme Raids",
    "Bellringer of Green Candles",
    "Torchbearer",
    "Standard-Bearer",
    "Banner of the Pump",
    "Keeper of Seed Phrases",
    "Guardian of Cold Wallets",
    "Warden of Floor Price",
    "Harvester of Airdrops",
    "Oracle of Green Candles",
    "Sealer of Multisigs",
    "Herald of Onchain Summer",
    "Grail Seeker",
    "Curator of Sacred JPEGs",
    "Caller of Raidcasts",
    "Invoker of Based Times",
    "Archivist of Rug Alerts",
] as const;

const OF_PARTS = [
    "Onchain Summer",
    "Meme Magic",
    "Sacred JPEGs",
    "DeFi Cloisters",
    "Airdrop Season",
    "GM Scriptures",
    "WAGMI Prophecy",
    "Based Times",
    "Grail Wallets",
    "Pump Rituals",
    "Far Lands (L2)",
    "MEV Winds",
    "Gas Altars",
    "Candlelit Charts",
    "RUG Chronicles",
    "Normie Tears",
    "Warpcast Choir",
    "Base Marches",
    "Copium Choir",
    "Depeg Myths",
    "Slippage Oracles",
    "Multisig Watch",
    "Aether Scan",
    "JPEGorum",
    "Dune Tablets",
    "Seed Sigils",
    "Onchain Relics",
    "Floor Vigil",
    "Mint Flames",
    "Bullrun Bells",
    "ATH Heralds",
    "Rekt Abbey",
    "Meme Treasury",
    "Pump Canticles",
    "Eternal GM",
    "Diamond Vows",
    "Lambo Dreams",
    "Watchtowers",
    "Candle Rooms",
    "Rugpull Catacombs",
    "Lost Keys",
    "LP Cauldrons",
    "Perp Eternal",
    "Liquid Staking",
    "ZK Sigils",
    "OP Citadels",
    "L2 Marches",
    "Finality",
    "Quantum Shitposts",
    "JPEG Cathedrals",
    "Raid Scrolls",
    "Memetic Crusades",
    "Hashrate Hymns",
    "Bridge Watch",
    "Oracle Feeds",
    "Copium Fountains",
    "Exit Liquidity Marshes",
    "Ath Bells",
    "Bonding Curves",
    "Liquidity Graves",
    "Onchain Liturgies",
    "Pump Psalms",
    "Dank Spellbooks",
    "Szn of Airdrops",
    "Farcaster Choirs",
    "X Altar",
    "DeFi Abbey",
    "Gasless Miracles",
] as const;

const RELICS = [
    "Onchain Relics",
    "Seed Sigils",
    "Dune Tablets",
    "Sacred JPEGs",
    "Grail Wallets",
    "Floor Vigils",
    "Mint Flames",
    "MEV Winds",
] as const;

const EPITHET = [
    "the Based",
    "the Unrugged",
    "the Diamond-Handed",
    "the Gas-Pardoned",
    "the Meme-Baptized",
    "the Rekt",
    "the Invictus",
    "the Watchful",
    "the Grailbound",
    "the Memetic",
    "the Candlelit",
    "the Unbroken",
    "the Unfudgable",
    "the Rug-Resistant",
    "the Candle-Blessed",
    "the Seed-Keeper",
    "the Raidcaller",
    "the Grail-Hunting",
] as const;

/* ========================= BASE TEMPLATES ========================= */
const LINKERS = ["of", "from", "of the", "under the Sigil of", "over the", "within the"] as const;

const TEMPLATES: string[] = [
    "{GREET} {NAME}, {HONOR} {LINK} {OF}",
    "{GREET} {NAME}, {HONOR} of {TICK}",
    "{GREET} {NAME}, {ROLE} of {OF} & Apostle of {TICK}",
    "{ROLE} {NAME}, {EPITHET}",
    "{GREET} {NAME}, Invoker of Based Times",
    "{GREET} {NAME}, Herald of {OF} {EPITHET}",
    "{GREET} {NAME}, {HONOR} from {OF}",
    "{NAME}, {ROLE}, {EPITHET}",
];

/* ================== ДОБАВКИ (мемные расширения) ================== */
const HONOR_M_MORE = [
    "Shitposter",
    "Alpha Caller",
    "Lord of Rugs",
    "Pump Herald",
    "Discord Raider",
    "Degenerate",
    "Liquidity Viking",
    "Copium Crusader",
    "Gas Priest",
    "Airdrop Farmer",
    "Chart Prophet",
    "FOMO Monk",
    "JPEG Collector",
    "Exit Liquidity Lord",
    "Bridge Troll",
    "Meme Sorcerer",
    "Uniswap Samurai",
    "DEX Paladin",
    "Based Templar",
    "Shill Knight",
    "Oracle of Rugs",
    "NGMI Knight",
    "Dump Prophet",
    "CT Prophet",
    "Giga Chad Knight",
] as const;

const HONOR_F_MORE = [
    "Lady Shitposter",
    "Alpha Calleress",
    "Pump Priestess",
    "Discord Raideress",
    "Liquidity Valkyrie",
    "JPEG Witch",
    "Chart Witch",
    "Shilleress",
    "Copium Priestess",
    "Airdrop Huntress",
    "Moon Witch",
    "NGMI Maiden",
    "Normie Slayeress",
    "Crypto Amazon",
    "Rugpull Valkyrie",
    "Meme Sorceress",
    "Degenerate Dame",
    "Liquidity Baroness",
    "DeFi Empress",
] as const;

const ROLE_MORE = [
    "Meme Prophet",
    "Keeper of Rugs",
    "JPEG Inquisitor",
    "Vault Breaker",
    "Bridge Dweller",
    "CT Scribe",
    "FOMO Seer",
    "Liquidity Summoner",
    "Moon Whisperer",
    "Pump Caller",
    "Raid Leader",
    "NFT Prophet",
    "Token Jester",
    "Bear Prophet",
    "Bull Summoner",
    "HODL Bard",
    "Copium Poet",
    "JPEG Archivist",
    "Multisig Sealer",
] as const;

const OF_PARTS_MORE = [
    "Telegram Dungeons",
    "Discord Catacombs",
    "Pump & Dump Choir",
    "Copium Wells",
    "VC Towers",
    "Based Tombs",
    "JPEG Mausoleums",
    "FOMO Arena",
    "Chart Catacombs",
    "NFT Crypts",
    "Liquidity Pools",
    "Token Graves",
    "Rekt Valleys",
    "Moon Temples",
    "Bear Market Pits",
    "DAO Chambers",
    "X Timelines",
    "Warpcast Halls",
    "Farmer Fields",
] as const;

const EPITHET_MORE = [
    "the Rugged",
    "the Shitposted",
    "the 69th",
    "the NGMI",
    "the Doomed",
    "the Moon-Blessed",
    "the Cope-Eternal",
    "the Rebased",
    "the Shilled",
    "the Based AF",
    "the Ape-Lord",
    "the Normie Slayer",
    "the Rugpull Survivor",
    "the Dumped",
    "the Pumped",
    "the JPEG-Blessed",
    "the Meme-Cursed",
    "the Overleveraged",
    "the Liquidated",
    "the WAGMI",
    "the NGMI Prophet",
    "the Moonchaser",
] as const;

const TEMPLATES_MORE: string[] = [
    "{GREET} {NAME}, Herald of {OF} {EPITHET}",
    "{GREET} {NAME}, Rugpull Survivor of {OF}",
    "{NAME}, {ROLE}, {EPITHET}",
    "{GREET} {NAME}, {HONOR} from {OF}",
    "{GREET} {NAME}, {ROLE} of {OF} & Apostle of {TICK}",
    "{ROLE} {NAME}, Keeper of {REL}",
    "{GREET} {NAME}, Caller of Meme Raids from {OF}",
    "{GREET} {NAME}, Watcher of {OF}, {EPITHET}",
    "{GREET} {NAME}, {HONOR} of {OF} and Bearer of {REL}",
];

/* ========== Объединяем старые + новые ========== */
const HONOR_M_EXPANDED = [...HONOR_M, ...HONOR_M_MORE] as const;
const HONOR_F_EXPANDED = [...HONOR_F, ...HONOR_F_MORE] as const;
const ROLE_EXPANDED = [...ROLE, ...ROLE_MORE] as const;
const OF_PARTS_EXPANDED = [...OF_PARTS, ...OF_PARTS_MORE] as const;
const EPITHET_EXPANDED = [...EPITHET, ...EPITHET_MORE] as const;
const TEMPLATES_EXPANDED = [...TEMPLATES, ...TEMPLATES_MORE];

/* ============================ UTILS =========================== */
function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* ========================== BUILD TITLE ======================= */
function makeTitle(rawName: string, gender: "Frater" | "Soror", _variant: number) {
    const NAME = latinizeName(rawName) || "Anon";

    const GREET = pickRandom(gender === "Frater" ? GREET_M : GREET_F);
    const HONOR = pickRandom(gender === "Frater" ? HONOR_M_EXPANDED : HONOR_F_EXPANDED);
    const ROLEv = pickRandom(ROLE_EXPANDED);
    const OF = pickRandom(OF_PARTS_EXPANDED);
    const REL = pickRandom(RELICS);
    const EP = pickRandom(EPITHET_EXPANDED);
    const TICK = pickRandom(MEME_TICKERS);
    const LINKERS_LOCAL = LINKERS; // просто чтобы было явно
    const LINK = pickRandom(LINKERS_LOCAL);
    const tpl = pickRandom(TEMPLATES_EXPANDED);

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
        `Claim Your Name: ${SITE_URL_OPEN}`,
    ].join("\n");
}
const shareX = (t: string) =>
    openPopup("https://twitter.com/intent/tweet?text=" + encodeURIComponent(buildShareMultiline(t, "x")));
const shareFC = (t: string) =>
    openPopup("https://warpcast.com/~/compose?text=" + encodeURIComponent(buildShareMultiline(t, "farcaster")));

/* ============================== UI ============================ */

export default function RitualTitleGenerator() {
    const [gender, setGender] = useState<"Frater" | "Soror">("Frater");
    const [name, setName] = useState("");
    const [variant, setVariant] = useState(0);
    const nameSndRef = useRef<HTMLAudioElement | null>(null);
    const composerRef = useRef<ShareImageComposerHandle | null>(null);
    const [tipVisible, setTipVisible] = useState(false);
    const [tipXY, setTipXY] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const tipText = (
        <>
            <div className="font-semibold">Image copied</div>
            <div className="text-xs opacity-80">Paste with Ctrl+V / Cmd+V</div>
        </>
    );
    const showTip = (e: any) => {
        setTipVisible(true);
        setTipXY({ x: e.clientX + 14, y: e.clientY + 18 });
    };
    const moveTip = (e: any) => {
        if (tipVisible) setTipXY({ x: e.clientX + 14, y: e.clientY + 18 });
    };
    const hideTip = () => setTipVisible(false);

    const playNameSnd = () => {
        try {
            if (!nameSndRef.current) return;
            nameSndRef.current.currentTime = 0;
            nameSndRef.current.volume = 0.5;
            void nameSndRef.current.play();
        } catch { }
    };

    const hasName = name.trim().length > 0;
    const title = useMemo(() => (hasName ? makeTitle(name, gender, variant) : ""), [name, gender, variant, hasName]);

    // Debounce: чтобы канвас не перерисовывался, пока печатают имя
    const [debouncedTitle, setDebouncedTitle] = useState<string>("");
    useEffect(() => {
        const t = setTimeout(() => setDebouncedTitle(title), 1000);
        return () => clearTimeout(t);
    }, [title]);

    async function shareWithCopy(platform: "x" | "farcaster") {
        await composerRef.current?.redraw();
        await composerRef.current?.copyImage();
        const text = buildShareMultiline(title, platform);
        const url =
            platform === "x"
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
                    <button onClick={() => (setVariant(0), setGender("Frater"))} className={gender === "Frater" ? "active" : ""}>
                        Frater
                    </button>
                    <button onClick={() => (setVariant(0), setGender("Soror"))} className={gender === "Soror" ? "active" : ""}>
                        Soror
                    </button>
                </div>
            </div>

            {/* reroll */}
            <div className="mt-4">
                <button disabled={!hasName} onClick={() => setVariant((v) => v + 1)} className="btn-medieval is-gilded is-sm w-full">
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
                            <button
                                onClick={() => shareWithCopy("x")}
                                onMouseEnter={showTip}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                                className="btn-ordo w-full"
                            >
                                ✖ Share on X
                            </button>
                            <button
                                onClick={() => shareWithCopy("farcaster")}
                                onMouseEnter={showTip}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                                className="btn-ordo w-full"
                            >
                                𝔉 Share on Farcaster
                            </button>
                        </div>

                        {/* secondary row: download/copy only */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                onClick={async () => {
                                    await composerRef.current?.redraw();
                                    composerRef.current?.downloadPNG();
                                }}
                                className="btn-ordo w-full"
                            >
                                ⬇ Download PNG
                            </button>
                            <button
                                onClick={async () => {
                                    await composerRef.current?.redraw();
                                    await composerRef.current?.copyImage();
                                }}
                                className="btn-ordo w-full"
                            >
                                📋 Copy Image
                            </button>
                        </div>

                        {/* Desktop preview under buttons */}
                        <div className="mt-2 hidden md:flex justify-center">
                            <div className="max-w-[80%]">
                                <ShareImageComposer
                                    ref={composerRef}
                                    title={debouncedTitle}
                                    cornerSrc="/corner_tile.png"
                                    sideSrc="/side_tile.png"
                                    compact={false}
                                />
                            </div>
                        </div>

                        {/* невидимый рендер PNG */}
                        <ShareImageComposer
                            ref={composerRef}
                            title={debouncedTitle}
                            cornerSrc="/corner_tile.png"
                            sideSrc="/side_tile.png"
                            compact
                        />
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
