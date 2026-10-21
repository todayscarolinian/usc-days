import { useId } from "react";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

export default function BestOfField({ value, onChange, disabled }: {
  value: 3 | 5; onChange: (value: 3 | 5) => void; disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Match format</Label>
      <Select value={String(value)} onValueChange={v => onChange(Number(v) as 3 | 5)} disabled={disabled}>
        <SelectTrigger id={id} className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="3">Best of 3 — non-placement</SelectItem>
          <SelectItem value="5">Best of 5 — placement</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {value === 5 ? "First to 3 sets. Sets 1–4 to 25; set 5 to 15." : "First to 2 sets. All sets to 25."} Win by two, no point cap.
      </p>
    </div>
  );
}
