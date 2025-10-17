import { z } from "zod";

const StandingSchema = z.object({
  team: z
    .string()
    .min(1, "Team name is required.")
    .refine((val) => val.trim().length > 0, "Team name cannot be empty."),

  wins: z
    .coerce.number()
    .min(0, "Wins cannot be negative.")
    .refine((n) => Number.isFinite(n), "Wins must be a valid number."),

  losses: z
    .coerce.number()
    .min(0, "Losses cannot be negative.")
    .refine((n) => Number.isFinite(n), "Losses must be a valid number."),

  winPct: z.string()
});

export default StandingSchema