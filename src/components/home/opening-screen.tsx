"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { markOpeningScreenSeen, startOpeningReveal, useOpeningScreenSeen } from "@/src/hooks/use-opening-screen";
import styles from "./opening-screen.module.css";

function TCMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 180 160" fill="currentColor" aria-hidden="true">
      <path d="M0 10H82V37H55V150H27V37H0Z" />
      <path d="M180 55H152C152 41 148 34 138 34C126 34 122 44 122 63V97C122 116 126 126 138 126C148 126 152 119 152 105H180C180 135 166 152 138 152C108 152 94 132 94 98V62C94 28 108 8 138 8C166 8 180 25 180 55Z" />
    </svg>
  );
}

export default function OpeningScreen() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [phase, setPhase] = useState<"loading" | "revealing" | "opening" | "done">("loading");

  const seen = useOpeningScreenSeen();
  const finished = seen || phase === "done";

  useLayoutEffect(() => {
    if (finished) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    // The server renders it open; upgrade it to a modal after hydration.
    if (dialog.open) dialog.close();
    dialog.showModal();
    dialog.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-opening-screen", "");
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.removeAttribute("data-opening-screen");
      document.body.removeAttribute("data-opening-phase");
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [finished]);

  useLayoutEffect(() => {
    if (phase === "done") {
      markOpeningScreenSeen();
      dialogRef.current?.close();
      return;
    }
    if (seen) return;
    document.body.setAttribute("data-opening-phase", phase);
    if (phase === "revealing") {
      startOpeningReveal();
      const timer = window.setTimeout(() => setPhase("opening"), 150);
      return () => window.clearTimeout(timer);
    }
    if (phase === "opening") {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const timer = window.setTimeout(() => setPhase("done"), reducedMotion ? 150 : 850);
      return () => window.clearTimeout(timer);
    }

    let cancelled = false;
    const minimum = new Promise<void>(resolve => window.setTimeout(resolve, 400));
    const hero = document.querySelector<HTMLImageElement>("#site-hero img");
    const ready = Promise.all([
      document.fonts.ready,
      hero?.decode().catch(() => undefined),
    ]);
    const fallback = window.setTimeout(() => setPhase("revealing"), 1200);
    void Promise.all([minimum, ready]).then(() => {
      if (!cancelled) setPhase("revealing");
    });
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [phase, seen]);

  // Finishing releases both the modal focus lock and the page scroll lock.
  if (finished) return null;

  return (
    <dialog
      ref={dialogRef}
      data-tc-opening
      open
      tabIndex={-1}
      aria-label="Welcome to USC Days"
      className={`${styles.screen} ${phase === "opening" ? styles.opening : ""}`}
      onCancel={(event) => { event.preventDefault(); setPhase("done"); }}
    >
      <span className="sr-only" role="status">Opening USC Days…</span>
      <div
        className={`${styles.panel} ${styles.top}`}
        aria-hidden="true"
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && phase === "opening") setPhase("done");
        }}
      >
        <div className={styles.canvas}><TCMark /></div>
      </div>
      <div className={`${styles.panel} ${styles.bottom}`} aria-hidden="true">
        <div className={styles.canvas}><TCMark /></div>
      </div>
      <button type="button" className={styles.skip} onClick={() => setPhase("done")}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </dialog>
  );
}
