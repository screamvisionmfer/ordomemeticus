/* src/components/OMHeaderPillIntegrated.tsx
 * Mobile: fullscreen overlay (centered), burger button on the right
 * Desktop: brand left; right side = Twitter / Farcaster / Linktree + CTA
 * Style: matches site (UnifrakturCook + blurred semi-transparent backdrop)
 */

import React, { useEffect, useState } from "react";

/** Replace with your real links */
export const LINKS = {
  join: "https://vibemarket.com/market/ordo-memeticus?ref=B3FLA1AGGOH2", // or route/modals anchor
  twitter: "https://x.com/scream_vision",
  farcaster: "https://farcaster.xyz/screamvision",
  linktree: "https://linktr.ee/screamvision",
  
};

const IconBurger = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} focusable={false} className={className}>
    <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" fill="currentColor"/>
  </svg>
);
const IconClose = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} focusable={false} className={className}>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export const SigilOM = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ordo Memeticus Sigil" focusable={false} className={className}>
    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M32 10v44M10 32h44" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const OMHeaderPillIntegrated: React.FC = () => {
  const [open, setOpen] = useState(false);

  // lock body scroll when overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const linkCls = "no-icon text-amber-100/90 hover:text-amber-100";

  return (
    <header className="fixed top-0 left-0 w-full z-40">
      <div className="backdrop-blur-xl bg-black/70 ring-1 ring-amber-500/20 border-b border-amber-500/20">
        <div className="mx-auto max-w-6xl px-4 py-2 md:py-3">

          {/* DESKTOP: brand left; socials + CTA right */}
          <div className="hidden md:flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 select-none">
              <SigilOM className="w-8 h-8 text-amber-300" />
              <span className="text-xl tracking-wide text-amber-100 font-[UnifrakturCook]">ORDO MEMETICUS</span>
            </a>
            <div className="flex items-center gap-6">
              
              <a href={LINKS.twitter} target="_blank" rel="noreferrer" className={linkCls}>Twitter</a>
              <a href={LINKS.farcaster} target="_blank" rel="noreferrer" className={linkCls}>Farcaster</a>
              <a href={LINKS.linktree} target="_blank" rel="noreferrer" className={linkCls}>Linktree</a>
              <a href={LINKS.join} className="inline-flex items-center px-3 py-2 text-sm font-semibold uppercase tracking-wide btn-medieval is-gilded is-sm">
                Join the Brotherhood
              </a>
            </div>
          </div>

          {/* MOBILE BAR: brand left, burger right */}
          <div className="md:hidden flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 select-none">
              <SigilOM className="w-7 h-7 text-amber-300" />
              <span className="text-lg tracking-wide text-amber-100 font-[UnifrakturCook]">ORDO MEMETICUS</span>
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="p-2 text-amber-100 border border-amber-500/30 hover:border-amber-400/50 bg-black/30 rounded"
            >
              <IconBurger className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE FULLSCREEN OVERLAY (centered content) */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
          {/* Close button top-right */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute top-3 right-3 p-2 text-amber-900 bg-amber-300 hover:bg-amber-200 rounded"
          >
            <IconClose className="w-5 h-5" />
          </button>

          {/* Centered stack */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 text-amber-100">
              <div className="flex items-center gap-3 select-none mb-2">
                <SigilOM className="w-8 h-8 text-amber-300" />
                <span className="text-xl tracking-wide font-[UnifrakturCook]">ORDO MEMETICUS</span>
              </div>
              <a href={LINKS.join} className="mt-2 inline-flex items-center px-5 py-2 text-base btn-medieval is-gilded is-full">
                Join the Brotherhood
              </a>
              <a href={LINKS.twitter} className="text-2xl font-[UnifrakturCook] no-icon">Twitter</a>
              <a href={LINKS.farcaster} className="text-2xl font-[UnifrakturCook] no-icon">Farcaster</a>
              <a href={LINKS.linktree} className="text-2xl font-[UnifrakturCook] no-icon">Linktree</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default OMHeaderPillIntegrated;
