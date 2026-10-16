"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -64 },
      allowNestedScroll: true,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
    });

    // Radix locks the body while dialogs and mobile navigation are open.
    function syncScrollLock() {
      if (document.body.hasAttribute("data-scroll-locked") || document.body.hasAttribute("data-opening-screen")) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }

    const observer = new MutationObserver(syncScrollLock);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked", "data-opening-screen"],
    });
    syncScrollLock();

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
