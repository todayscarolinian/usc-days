"use client";

import { CircleAlert, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface LoadErrorProps {
  title: string;
  isRetrying: boolean;
  onRetry: () => void;
}

export default function LoadError({ title, isRetrying, onRetry }: LoadErrorProps) {
  return (
    <div
      role="alert"
      className="flex w-full items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-red-600" />
      <div className="flex flex-1 flex-col items-start gap-2">
        <div>
          <p className="text-sm font-semibold text-red-700">{title}</p>
          <p className="text-xs text-red-600/80">Check your connection and try again.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isRetrying}
          onClick={onRetry}
          className="border-red-200 bg-white text-red-700 hover:bg-red-100 hover:text-red-800"
        >
          <RotateCw className={isRetrying ? "animate-spin" : undefined} />
          {isRetrying ? "Retrying..." : "Try again"}
        </Button>
      </div>
    </div>
  );
}
