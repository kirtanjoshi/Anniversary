"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import { useEffect, useState } from "react";
import { ISSUE_YEAR, START_YEAR } from "@/lib/content";
import Ambient from "./Ambient";
import Book from "./Book";
import { music } from "./Magazine";

const ease: Transition["ease"] = [0.22, 0.7, 0.2, 1];
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 1.2, ease },
});

export default function Experience() {
  const [open, setOpen] = useState(false);

  // Deep links like /#p13 skip the intro and open on that page.
  useEffect(() => {
    if (/^#p\d+$/.test(location.hash)) requestAnimationFrame(() => setOpen(true));
  }, []);

  return (
    <>
      <Ambient />

      <motion.main
        className="scene"
        initial={false}
        animate={open ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 40 }}
        transition={{ duration: 1.5, ease, delay: open ? 0.45 : 0 }}
        aria-hidden={!open}
      >
        <Book />
      </motion.main>

      <AnimatePresence>
        {!open && (
          <motion.section
            className="intro"
            key="intro"
            exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
            transition={{ duration: 1.1, ease }}
          >
            <motion.p className="intro__kicker" {...rise(0.2)}>
              A personal edition · print run of one
            </motion.p>
            <motion.p className="intro__script" {...rise(0.5)}>
              for you,
            </motion.p>
            <motion.h1 className="intro__title" {...rise(0.8)}>
              The Two <em>of</em> Us
            </motion.h1>
            <motion.p className="intro__years" {...rise(1.1)}>
              Five years · {START_YEAR} — {ISSUE_YEAR}
            </motion.p>
            <motion.button
              type="button"
              className="seal"
              onClick={() => {
                // Must start inside the tap, or phones block it as autoplay.
                const a = music();
                a.src = "/songs/hataarindai.mp3";
                a.loop = true;
                a.play().catch(() => {});
                setOpen(true);
              }}
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 140, damping: 12 }}
              whileHover={{ scale: 1.07, rotate: 0 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Open the magazine"
            >
              <span>open</span>
            </motion.button>
            <motion.p className="intro__hint" {...rise(2)}>
              turn the pages slowly · sound on
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
