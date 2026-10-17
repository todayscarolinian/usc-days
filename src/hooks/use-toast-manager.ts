import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

export function useToastManager({ inlineMobileErrors = false } = {}) {
  const [activeToasts, setActiveToasts] = useState<Set<string | number>>(new Set());
  const [inlineError, setInlineError] = useState<{ title: string; description?: string } | null>(null);
  const toastsRef = useRef(activeToasts);

  // Keep ref in sync with state
  useEffect(() => {
    toastsRef.current = activeToasts;
  }, [activeToasts]);

  const showToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      if (inlineMobileErrors && type === "error" && window.matchMedia("(max-width: 639px)").matches) {
        setInlineError({ title, description });
        return;
      }
      const id = toast[type](title, { description });
      setActiveToasts((prev) => new Set(prev).add(id));
      return id;
    },
    [inlineMobileErrors]
  );

  const dismissToast = useCallback((id: string | number) => {
    toast.dismiss(id);
    setActiveToasts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const dismissAll = useCallback(() => {
    toastsRef.current.forEach((id) => toast.dismiss(id));
    setActiveToasts(new Set());
    setInlineError(null);
  }, []);

  const clearInlineError = useCallback(() => setInlineError(null), []);

  return {
    showToast,
    dismissToast,
    dismissAll,
    hasActiveToasts: activeToasts.size > 0,
    inlineError,
    clearInlineError,
  };
}
