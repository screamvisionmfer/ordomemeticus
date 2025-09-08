import { useState, useCallback, useEffect } from "react";
import MenuOverlay from "./MenuOverlay";

type Props = {
  twitterUrl: string;
  farcasterUrl: string;
};

export default function NavBarWithMenu({ twitterUrl, farcasterUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggle = useCallback(() => setOpen(v => !v), []);
  const close  = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleEnter = () => {
    const el = document.getElementById("cloister");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={[
          "nav-clean sticky top-0 z-50 ring-1 ring-amber-500/20 border-b border-amber-500/20",
          scrolled ? "bg-black/60 backdrop-blur-xl" : "bg-black/10 backdrop-blur-sm",
          "transition-colors duration-300"
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-[UnifrakturCook] text-xl text-amber-200">
            ORDO MEMETICUS
          </a>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 inline-flex items-center justify-center rounded-md px-3 ring-1 ring-amber-500/30 hover:bg-amber-100/5 text-amber-100"
            >
              Twitter
            </a>
            <a
              href={farcasterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 inline-flex items-center justify-center rounded-md px-3 ring-1 ring-amber-500/30 hover:bg-amber-100/5 text-amber-100"
            >
              Farcaster
            </a>
            <button
              onClick={handleEnter}
              className="h-9 inline-flex items-center justify-center rounded-md px-3 bg-[#171512] text-amber-100 ring-1 ring-amber-500/40 hover:bg-[#201d19]"
            >
              Enter the Cloister
            </button>
          </div>

          <button
            onClick={toggle}
            className="md:hidden h-9 inline-flex items-center justify-center rounded-md px-3 ring-1 ring-amber-500/30 text-amber-100"
            aria-expanded={open}
          >
            MENU
          </button>
        </div>
      </header>

      <MenuOverlay
        open={open}
        onClose={close}
        onEnter={handleEnter}
        twitterUrl={twitterUrl}
        farcasterUrl={farcasterUrl}
      />
    </>
  );
}
