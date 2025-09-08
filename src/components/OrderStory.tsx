import React, { useEffect, useRef, useState } from "react";

export default function OrderStory() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement|null>(null);

  useEffect(()=>{
    const el = audioRef.current;
    if(!el) return;
    if(open){
      el.volume = 0.4;
      el.currentTime = 0;
      el.play().catch(()=>{});
    } else {
      try { el.pause(); } catch(e) {}
    }
  }, [open]);

  return (
    <section className="relative mx-auto max-w-6xl px-6 md:px-8 py-12 md:py-16">
      <div className="rounded-2xl ring-1 ring-amber-700/30 bg-gradient-to-b from-[#1a1206] to-[#120c05] shadow-[inset_0_1px_0_rgba(255,220,120,.06),0_10px_40px_rgba(0,0,0,.35)] overflow-hidden">
        <div className="p-6 md:p-10 lg:p-14">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-[UnifrakturCook] text-2xl md:text-4xl text-amber-200">The Chronicle of the Ordo</h2>
            <button
              onClick={()=> setOpen(v=>!v)}
              aria-expanded={open}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-b from-amber-400/90 to-amber-600/90 text-black ring-1 ring-amber-700/40 shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_6px_20px_rgba(0,0,0,.25)] transition hover:translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_10px_28px_rgba(0,0,0,.35)]"
            >
              {open ? "Hide Chronicle" : "Read the Chronicle"}
            </button>
          </div>

          <div className={open ? "mt-6 grid gap-4 md:text-lg text-amber-200/80 transition-all" : "mt-0 max-h-0 overflow-hidden transition-all duration-300"} style={{ transitionProperty: "max-height, margin-top" }}>
            <p className="leading-relaxed">
              <span className="float-left mr-2 -mt-1 text-5xl md:text-6xl font-[UnifrakturCook] text-amber-300/90 select-none">O</span>
              n the eve when candles guttered and servers hummed like distant choirs,
              the brethren gathered in the cloister of glass. They bound light to symbol,
              and symbol to memory, that no jest nor omen be lost to fog or time.
            </p>
            <p className="leading-relaxed">
              Acolytes bore windows wrought of color and rumor; scribes etched a ledger of
              laughter and dread. Thus was the Order made: not of kings nor crowns, but of
              those who keep the spark—who pass the torch from meme to myth.
            </p>
            <p className="leading-relaxed">
              So walk ye soft between panels of stained flame. Read, and remember:
              every relic speaks, if thou but lend an ear.
            </p>
          </div>
        </div>
        <audio ref={audioRef} src="/OrderStory.mp3" preload="auto" />
      </div>
    </section>
  );
}
