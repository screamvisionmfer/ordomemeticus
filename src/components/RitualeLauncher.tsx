import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import RitualTitleGenerator from "@/components/RitualTitleGenerator";

const hasWin = typeof window !== "undefined";
const hasDoc = typeof document !== "undefined";

function shouldOpenFromURL() {
    if (!hasWin) return false;
    return (
        window.location.hash === "#rituale" ||
        new URLSearchParams(window.location.search).get("rituale") === "1"
    );
}
function pushOpenURL() {
    if (!hasWin) return;
    const url = new URL(window.location.href);
    url.hash = "rituale";
    window.history.replaceState({}, "", url.toString());
}
function clearOpenURL() {
    if (!hasWin) return;
    const url = new URL(window.location.href);
    if (url.hash === "#rituale") url.hash = "";
    url.searchParams.delete("rituale");
    window.history.replaceState({}, "", url.toString());
}

export default function RitualeLauncher() {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    const openModal = useCallback(() => {
        setOpen(true);
        pushOpenURL();
        if (hasDoc) document.documentElement.classList.add("overflow-hidden");
    }, []);
    const closeModal = useCallback(() => {
        setOpen(false);
        clearOpenURL();
        if (hasDoc) document.documentElement.classList.remove("overflow-hidden");
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (shouldOpenFromURL()) openModal();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        if (hasWin) window.addEventListener("keydown", onKey);
        return () => {
            if (hasWin) window.removeEventListener("keydown", onKey);
        };
    }, [mounted, openModal, closeModal]);

    const portalTarget = useMemo(() => {
        if (!hasDoc) return null;
        let el = document.getElementById("rituale-portal-root");
        if (!el) {
            el = document.createElement("div");
            el.id = "rituale-portal-root";
            document.body.appendChild(el);
        }
        return el;
    }, []);

    return (
        <>
            <div className="flex justify-center">
                <button onClick={openModal} className="btn-medieval is-rune is-lm px-8 py-4">
                    🔮 Open Rituale Nominis
                </button>
            </div>

            {mounted && portalTarget && createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            id="rituale-modal"
                            className="fixed inset-0 z-[100] flex items-center justify-center"
                            aria-modal="true"
                            role="dialog"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* затемнение + BLUR фона */}
                            <motion.div
                                onClick={closeModal}
                                className="absolute inset-0 bg-black/60"
                                initial={{ backdropFilter: "blur(0px)" }}
                                animate={{ backdropFilter: "blur(8px)" }}
                                exit={{ backdropFilter: "blur(0px)" }}
                                transition={{ duration: 0.5 }}
                            />

                            {/* контейнер модалки + ореол сзади */}
                            <motion.div
                                className="relative w-[min(90vw,980px)] halo-parent"
                                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97, y: 6 }}
                                transition={{ duration: 0.28, ease: "easeOut" }}
                            >
                                {/* Ореол ПОЗАДИ окна */}
                                <div className="holy-halo -z-10" />

                                {/* Рамка HoMM (углы + стороны) */}
                                <div className="relative z-10 bg-stone-900/95 shadow-2xl homm-frame" style={{ padding: 32, maxHeight: "92vh" }}>
                                    {/* стороны */}
                                    <div className="absolute top-0 left-8 right-8 h-8" style={{ background: 'url("/side_tile.png") repeat-x' }} />
                                    <div className="absolute bottom-0 left-8 right-8 h-8" style={{ background: 'url("/side_tile.png") repeat-x', transform: 'scaleY(-1)' }} />
                                    <div className="absolute top-8 bottom-8 left-0 w-8" style={{ background: 'url("/side_tile.png") repeat-y' }} />
                                    <div className="absolute top-8 bottom-8 right-0 w-8" style={{ background: 'url("/side_tile.png") repeat-y', transform: 'scaleX(-1)' }} />
                                    {/* углы */}
                                    <img src="/corner_tile.png" className="absolute top-0 left-0 w-8 h-8" />
                                    <img src="/corner_tile.png" className="absolute top-0 right-0 w-8 h-8" />
                                    <img src="/corner_tile.png" className="absolute bottom-0 right-0 w-8 h-8" />
                                    <img src="/corner_tile.png" className="absolute bottom-0 left-0 w-8 h-8" />

                                    {/* контент */}
                                    <div className="relative px-6 pb-6 pt-4">
                                        <div className="flex items-center justify-center">
                                            <h2 className="font-[UnifrakturCook] text-3xl md:text-4xl text-amber-200 flicker text-center">
                                                Rituale Nominis
                                            </h2>
                                            <button
                                                onClick={closeModal}
                                                className="absolute right-3 top-3 rounded-md px-2 py-1 text-amber-200/80 hover:bg-stone-800/60"
                                                aria-label="Close"
                                                title="Close"
                                            >✕</button>
                                        </div>

                                        <div className="mt-3 h-px w-full bg-gradient-to-r from-amber-500/20 via-amber-300/40 to-amber-500/20" />

                                        <div className="mt-5">
                                            <RitualTitleGenerator />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                portalTarget
            )}
        </>
    );
}
