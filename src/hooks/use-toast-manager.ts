import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

export function useToastManager() {
  const [activeToasts, setActiveToasts] = useState<Set<string | number>>(new Set());
  const toastsRef = useRef(activeToasts);

  // Keep ref in sync with state
  useEffect(() => {
    toastsRef.current = activeToasts;
  }, [activeToasts]);

  const showToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = toast[type](title, { description });
      setActiveToasts((prev) => new Set(prev).add(id));
      return id;
    },
    []
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
  }, []);

  return {
    showToast,
    dismissToast,
    dismissAll,
    hasActiveToasts: activeToasts.size > 0,
  };
}