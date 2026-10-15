import { useCallback, useEffect, useState } from "react";

// Shared across mounts so carousels keep their place when navigating between pages.
let carouselStartedAt: number | null = null;

function getCarouselIndex(length: number, interval: number) {
  if (carouselStartedAt === null || length < 2) return 0;

  return Math.floor((Date.now() - carouselStartedAt) / interval) % length;
}

export function useSharedCarouselIndex(length: number, interval: number) {
  const [activeIndex, setActiveIndex] = useState(() =>
    getCarouselIndex(length, interval),
  );
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    if (length < 2) return;

    if (carouselStartedAt === null) {
      carouselStartedAt = Date.now();
    }

    let timer: number;

    function scheduleNext() {
      const startedAt = carouselStartedAt ?? Date.now();
      const elapsed = (Date.now() - startedAt) % interval;

      timer = window.setTimeout(() => {
        setActiveIndex(getCarouselIndex(length, interval));
        scheduleNext();
      }, interval - elapsed);
    }

    scheduleNext();

    return () => window.clearTimeout(timer);
  }, [length, interval, restartKey]);

  const goTo = useCallback(
    (index: number) => {
      // Shift the shared clock so the chosen slide gets a full interval.
      carouselStartedAt = Date.now() - index * interval;
      setActiveIndex(index);
      setRestartKey((key) => key + 1);
    },
    [interval],
  );

  return { activeIndex, goTo };
}
