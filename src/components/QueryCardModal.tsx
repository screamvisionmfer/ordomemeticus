import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryParam } from "@/hooks/useQueryParam";

/**
 * Minimal fullscreen modal that appears whenever URL has ?id=<cardId>.
 * It does not assume your card data shape — just displays the ID slot.
 * Replace inner content with your real Lightbox if you have one.
 */
export default function QueryCardModal() {
  const [id, setId] = useQueryParam("id");

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setId]);

  const isOpen = Boolean(id);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="query-card-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="relative w-[min(90vw,1000px)] h-[min(90vh,1000px)] bg-neutral-900/70 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setId(null)}
              className="absolute right-3 top-3 px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-md"
            >
              Close
            </button>

            <div className="w-full h-full grid place-items-center p-6 text-center">
              <div>
                <div className="text-xs uppercase tracking-widest opacity-60 mb-2">Query ID</div>
                <div className="text-4xl font-bold">{id}</div>
                <div className="mt-4 opacity-80 max-w-[48ch] mx-auto">
                  Replace this with your real card view for the selected ID.
                  Keep the query-string approach: closing the modal must clear the <code>?id</code> param.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Helper to attach onClick to any card element:
 * <div onClick={() => openCardModal(card.id)} />
 */
export function openCardModal(id: string | number) {
  const url = new URL(window.location.href);
  url.searchParams.set("id", String(id));
  window.history.pushState({}, "", url.toString());
}
