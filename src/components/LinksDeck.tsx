import React from "react";
import { createPortal } from "react-dom";

type Props = {
  show?: boolean;
  dexscreener?: string;
  opensea?: string;
  disableDex?: boolean;
};

export default function LinksDeck({
  show = true,
  dexscreener = "#",
  opensea = "https://opensea.io/collection/ordo-memeticus",
  disableDex = true,
}: Props) {
  if (!show || typeof document === "undefined") return null;

  // Рендерим в body → вне локальных stacking contexts
  let root = document.getElementById("links-dock-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "links-dock-root";
    document.body.appendChild(root);
  }

  const Item: React.FC<{
    href: string;
    img: string;
    label: string;
    disabled?: boolean;
  }> = ({ href, img, label, disabled }) => {
    const Wrapper: any = disabled ? "div" : "a";
    const common = disabled
      ? {}
      : { href, target: "_blank", rel: "noopener noreferrer", "aria-label": label, title: label };

    return (
      <Wrapper
        {...common}
        className="group relative flex items-center overflow-visible"
        title={disabled ? `${label} (soon)` : label}
      >
        {/* На мобиле — без выезда; на десктопе — выезжает */}
        <div className="translate-x-0 md:translate-x-[-20px] md:group-hover:translate-x-0 transition-transform duration-300 ease-out flex items-center">
          <div
            className={[
              // квадрат: мобайл 56px, десктоп 80px
              "w-14 h-14 md:w-20 md:h-20",
              // фон/рамка
              "bg-black/70 backdrop-blur-md ring-1 ring-amber-500/30 md:group-hover:ring-amber-300/70",
              // форма
              "rounded-md md:rounded-r-xl",
              // тень/анимка
              "grid place-items-center shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out",
              disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-black/80 cursor-pointer",
            ].join(" ")}
          >
            <img
              src={img}
              alt={label}
              className="transition-opacity duration-200"
              style={{ width: "2rem", height: "2rem" }} // ~32px
            />
          </div>

          {/* подпись только на десктопе */}
          <span
            className={[
              "hidden md:inline-block",
              "ml-2 text-amber-200 text-base whitespace-nowrap",
              "opacity-0 md:group-hover:opacity-100",
              "translate-x-[-6px] md:group-hover:translate-x-0",
              "transition-all duration-300",
            ].join(" ")}
          >
            {label}
            {disabled ? " (soon)" : ""}
          </span>
        </div>
      </Wrapper>
    );
  };

  const dock = (
    <div
      className="
        fixed z-[45]
        left-4 bottom-[max(1rem,env(safe-area-inset-bottom))] flex flex-row gap-2
        md:right-auto md:left-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-3
      "
    >
      <Item href={dexscreener} img="/dex.png" label="DexScreener" disabled={disableDex} />
      <Item href={opensea} img="/opensea.png" label="OpenSea" />
    </div>
  );

  return createPortal(dock, root);
}
