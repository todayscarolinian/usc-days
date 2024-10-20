import { z } from 'zod';

export const AddScoreSchema = z.object({
  gameId: z.number({
    required_error: "gameId is required.",
    invalid_type_error: "gameId must be a number.",
  }),
  teamAScore: z.number({
    required_error: "teamAScore is required.",
    invalid_type_error: "teamAScore must be a number.",
  }).min(0, "teamAScore cannot be negative."),
  teamBScore: z.number({
    required_error: "teamBScore is required.",
    invalid_type_error: "teamBScore must be a number.",
  }).min(0, "teamBScore cannot be negative."),
  createdById: z.number({
    required_error: "createdById is required.",
    invalid_type_error: "createdById must be a number.",
  }),
});

export const EditScoreSchema = z.object({
  gameId: z.number({
    required_error: "gameId is required.",
    invalid_type_error: "gameId must be a number.",
  }),
  teamAScore: z.number({
    required_error: "teamAScore is required.",
    invalid_type_error: "teamAScore must be a number.",
  }).min(0, "teamAScore cannot be negative."),
  teamBScore: z.number({
    required_error: "teamBScore is required.",
    invalid_type_error: "teamBScore must be a number.",
  }).min(0, "teamBScore cannot be negative."),
});

export const DeleteScoreSchema = z.object({
  gameId: z.number({
    required_error: "gameId is required.",
    invalid_type_error: "gameId must be a number.",
  }),
});

export type AddScorePayload = z.infer<typeof AddScoreSchema>;
export type EditScorePayload = z.infer<typeof EditScoreSchema>;
export type DeleteScorePayload = z.infer<typeof DeleteScoreSchema>;
