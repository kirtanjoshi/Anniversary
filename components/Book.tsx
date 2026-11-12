"use client";

import { useEffect, useRef, useState } from "react";
import type { PageFlip } from "page-flip";
import { PAGES } from "./Magazine";

const LAST = PAGES.length - 1;
const pad = (n: number) => String(n).padStart(2, "0");

// Paper-turn sound, synthesised (no audio file): band-passed noise swept upward.
let audio: AudioContext | null = null;
function rustle() {
  audio ??= new AudioContext();
  if (audio.state === "suspended") void audio.resume();
  const dur = 0.5;
  const t0 = audio.currentTime;
  const buf = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    const t = i / d.length;
    d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) ** 2 * (1 - 0.6 * t);
  }
  const src = audio.createBufferSource();
  src.buffer = buf;
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.8;
  band.frequency.setValueAtTime(700, t0);
  band.frequency.exponentialRampToValueAtTime(3600, t0 + dur);
  const gain = audio.createGain();
  gain.gain.value = 0.28;
  src.connect(band).connect(gain).connect(audio.destination);
  src.start();
}

export default function Book() {
  const rootRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const soundRef = useRef(true);
  const [cur, setCur] = useState(0);
  const [landscape, setLandscape] = useState(true);
  const [ready, setReady] = useState(false);
  const [sound, setSound] = useState(true);
  const [turning, setTurning] = useState(false);

  useEffect(() => {
    const root = rootRef.current!;
    const items = Array.from(root.querySelectorAll<HTMLElement>(":scope > .page"));
    const start = Math.min(LAST, Number(location.hash.match(/^#p(\d+)$/)?.[1] ?? 0));
    let pf: PageFlip | null = null;
    let disposed = false;

    import("page-flip").then(({ PageFlip }) => {
      if (disposed) return;
      pf = new PageFlip(root, {
        width: 1000,
        height: 1180,
        size: "stretch",
        minWidth: 220,
        maxWidth: 1100,
        minHeight: 260,
        maxHeight: 1300,
        startPage: start,
        showCover: true,
        usePortrait: true,
        flippingTime: 950,
        maxShadowOpacity: 0.45,
        mobileScrollSupport: false,
        swipeDistance: 20,
      });
      pf.on("init", (e) => {
        const { page, mode } = e.data as { page: number; mode: string };
        setCur(page);
        setLandscape(mode === "landscape");
        setReady(true);
      });
      pf.on("flip", (e) => setCur(e.data as number));
      pf.on("changeOrientation", (e) => setLandscape(e.data === "landscape"));
      pf.on("changeState", (e) => {
        setTurning(e.data === "flipping");
        if (e.data === "flipping" && soundRef.current) rustle();
      });
      pf.loadFromHTML(items);
      flipRef.current = pf;
    });

    return () => {
      disposed = true;
      if (!pf) return;
      // page-flip's destroy() deletes the root React owns; hand the pages back and drop only its wrappers.
      items.forEach((el) => root.appendChild(el));
      pf.getUI().destroy();
      flipRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipRef.current?.flipNext();
      if (e.key === "ArrowLeft") flipRef.current?.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Only the open spread's clips play, so phones never decode every video in the issue at once.
  useEffect(() => {
    document.querySelectorAll<HTMLVideoElement>(".pg video").forEach((v) => {
      if (v.closest('[data-active="true"]')) v.play().catch(() => {});
      else v.pause();
    });
  }, [cur, landscape, ready]);

  const toggleSound = () => {
    soundRef.current = !soundRef.current;
    setSound(soundRef.current);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  // In a spread, the page right of `cur` is visible too (except the lone cover / back cover).
  const isActive = (i: number) => i === cur || (landscape && cur !== 0 && i === cur + 1);
  // Centre the closed book (lone cover / back cover); it slides open as the first page turns.
  const at = !landscape || turning ? undefined : cur === 0 ? "start" : cur === LAST ? "end" : undefined;
  const label =
    cur === 0 ? "Cover" : cur === LAST ? "Back cover" : landscape && cur + 1 <= LAST ? `${pad(cur)} – ${pad(cur + 1)}` : pad(cur);

  return (
    <>
      <div className={`stage${ready ? " is-ready" : ""}`} data-at={at}>
        <div ref={rootRef} className="book">
          {PAGES.map((p, i) => (
            <div key={i} className="page" data-density={p.hard ? "hard" : "soft"}>
              <div className={`pg pg--${p.tone}`} data-active={isActive(i)}>
                {p.body}
                {!p.hard && (
                  <span className={`folio ${i % 2 ? "folio--l" : "folio--r"}`}>
                    {pad(i)} <em>The Two of Us</em>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="nav nav--prev" onClick={() => flipRef.current?.flipPrev()} disabled={cur === 0} aria-label="Previous page">
        <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" className="nav nav--next" onClick={() => flipRef.current?.flipNext()} disabled={cur >= LAST - (landscape ? 1 : 0)} aria-label="Next page">
        <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
      </button>

      <header className="topbar">
        <span className="topbar__brand">
          The Two <em>of</em> Us
        </span>
        <div className="topbar__tools">
          <button type="button" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? "Mute page sound" : "Unmute page sound"}>
            <svg viewBox="0 0 24 24">
              <path d="M4 9h4l5-4v14l-5-4H4z" />
              {sound ? <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" /> : <path d="M17 9l5 6M22 9l-5 6" />}
            </svg>
          </button>
          <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
            <svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
          </button>
        </div>
      </header>

      <footer className="pager">
        <span>{label}</span>
        <div className="pager__track">
          <i style={{ width: `${(cur / LAST) * 100}%` }} />
        </div>
        <span>{pad(LAST)}</span>
      </footer>

      <p className="rotate-hint">Turn your phone sideways for the full spread ↻</p>
    </>
  );
}
