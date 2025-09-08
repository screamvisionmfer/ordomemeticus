import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  onEnter?: () => void;
  twitterUrl: string;
  farcasterUrl: string;
};

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panel = {
  hidden: { y: "-6%", opacity: 0.6 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "tween", duration: 0.24, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    y: "-4%",
    opacity: 0,
    transition: { type: "tween", duration: 0.18, ease: [0.4, 0, 1, 1] }
  },
};

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } }
};

const item = {
  hidden: { y: 6, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", stiffness: 420, damping: 28, mass: 0.6 }
  }
};

export default function MenuOverlay({ open, onClose, onEnter, twitterUrl, farcasterUrl }: Props) {
  useEffect(() => {
    if (open) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseDown={onBackdropClick}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            variants={panel}
            className="absolute inset-0 bg-[#0B0A08] text-amber-100"
          >
            {/* Close */}
            <button
              aria-label="Close menu"
              onClick={onClose}
              className="absolute right-4 top-4 h-9 min-w-9 px-2 text-xl leading-none ring-1 ring-amber-400/40 rounded-md hover:bg-amber-100/5"
            >
              ×
            </button>

            <div className="h-full w-full flex items-center justify-center">
              <motion.nav
                variants={list}
                initial="hidden"
                animate="visible"
                className="w-full max-w-sm mx-auto px-6 text-center"
              >
                <motion.button
                  variants={item}
                  onClick={() => { onEnter?.(); onClose(); }}
                  className="w-full mb-5 h-12 inline-flex items-center justify-center rounded-md bg-[#171512] text-amber-100 ring-1 ring-amber-500/40 hover:bg-[#201d19]"
                >
                  Enter the Cloister
                </motion.button>

                <motion.a
                  variants={item}
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mb-3 h-12 leading-[48px] rounded-md ring-1 ring-amber-500/30 hover:bg-amber-100/5"
                >
                  Twitter
                </motion.a>

                <motion.a
                  variants={item}
                  href={farcasterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-12 leading-[48px] rounded-md ring-1 ring-amber-500/30 hover:bg-amber-100/5"
                >
                  Farcaster
                </motion.a>
              </motion.nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
