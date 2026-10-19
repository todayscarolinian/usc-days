"use client";

import { useId } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function ScheduleLabelField({ value, onChange, error }: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const id = useId();

  return (
    <div className="flex min-w-0 w-full flex-col gap-1">
      <Label htmlFor={id} className="font-bold opacity-50">Custom label (optional)</Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={100}
        placeholder="e.g. Fighting for 2nd, Championship match"
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
      />
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        Shown on the schedule card. Leave blank for no label.
      </p>
      {error && <span id={`${id}-error`} className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
