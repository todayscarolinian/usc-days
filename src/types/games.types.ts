import { z } from "zod";
import { Schedules } from "./types";

export const SCORES_REQUIRE_TEAMS_MESSAGE =
  "Scores and results cannot be saved until both teams are set.";

export const ScheduleLabelSchema = z
  .string()
  .trim()
  .max(100, "Custom label must be 100 characters or fewer.")
  .transform((value) => value || null)
  .nullable()
  .optional();

/** A numeric score (including 0) or an actual result. False flags and nulls do not count. */
export function hasSavedResult(data: {
  teamAScore?: unknown;
  teamBScore?: unknown;
  winnerId?: number | null;
  teamAForfeited?: boolean | null;
  teamBForfeited?: boolean | null;
  isDraw?: boolean | null;
}): boolean {
  return (
    data.teamAScore != null ||
    data.teamBScore != null ||
    data.winnerId != null ||
    data.teamAForfeited === true ||
    data.teamBForfeited === true ||
    data.isDraw === true
  );
}

export const MULTI_TEAM_HAS_NO_AB_MESSAGE =
  "Multi-team games list their teams as participants, not as team A and team B.";

/** Teams in a multi-team game. Format-specific rules are checked in the service. */
export const ParticipantTeamIdsSchema = z
  .array(z.number({ error: "Participant team selection is invalid." }).int())
  .min(2, "Please select at least two teams.")
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "Each team can only be added once.",
  })
  .optional();

export const AddGameSchema = z
  .object({
    gameTypeId: z.number({
      error: (issue) =>
        issue.input === undefined
          ? "Please select a sport."
          : "Sport selection is invalid.",
    }),
    teamAId: z
      .number({
        error: "First team selection is invalid.",
      })
      .nullable()
      .optional(),
    teamBId: z
      .number({
        error: "Second team selection is invalid.",
      })
      .nullable()
      .optional(),
    startDate: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Start date is required."
            : "Start date must be a valid date.",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Please enter a valid start date.",
      }),
    endDate: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "End date is required."
            : "End date must be a valid date.",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Please enter a valid end date.",
      }),
    location: z.string().optional(),
    label: ScheduleLabelSchema,
    participantTeamIds: ParticipantTeamIdsSchema,
  })
  .refine(
    (data) =>
      data.participantTeamIds === undefined ||
      (data.teamAId == null && data.teamBId == null),
    { message: MULTI_TEAM_HAS_NO_AB_MESSAGE, path: ["participantTeamIds"] },
  )
  .refine(
    (data) =>
      data.teamAId == null ||
      data.teamBId == null ||
      data.teamAId !== data.teamBId,
    {
      message: "Please select two different teams.",
      path: ["teamBId"],
    },
  )
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be on or after start date.",
    path: ["endDate"],
  });

export const EditGameSchema = z
  .object({
    gameTypeId: z.number({
      error: (issue) =>
        issue.input === undefined
          ? "gameTypeId is required."
          : "gameTypeId must be a number.",
    }),
    teamAId: z
      .number({
        error: "teamAId must be a number.",
      })
      .nullable(),
    teamBId: z
      .number({
        error: "teamBId must be a number.",
      })
      .nullable(),
    teamAScore: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "teamAScore is required."
            : "teamAScore must be a number.",
      })
      .min(0, "teamAScore cannot be negative.")
      .nullable()
      .optional(),
    teamBScore: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "teamBScore is required."
            : "teamBScore must be a number.",
      })
      .min(0, "teamBScore cannot be negative.")
      .nullable()
      .optional(),
    winnerId: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "winnerId is required."
            : "winnerId must be a number.",
      })
      .nullable()
      .optional(),
    startDate: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "startDate is required."
            : "startDate must be a valid ISO date string.",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for startDate. Use ISO format.",
      }),
    endDate: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "endDate is required."
            : "endDate must be a valid ISO date string.",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for endDate. Use ISO format.",
      }),
    location: z.string().nullable().optional(),
    label: ScheduleLabelSchema,
    teamAForfeited: z.boolean().optional(),
    teamBForfeited: z.boolean().optional(),
    isDraw: z.boolean().optional(),
    participantTeamIds: ParticipantTeamIdsSchema,
  })
  .refine(
    (data) =>
      data.participantTeamIds === undefined ||
      (data.teamAId == null && data.teamBId == null && !hasSavedResult(data)),
    { message: MULTI_TEAM_HAS_NO_AB_MESSAGE, path: ["participantTeamIds"] },
  )
  .refine(
    (data) =>
      data.teamAId == null ||
      data.teamBId == null ||
      data.teamAId !== data.teamBId,
    {
      message: "teamAId and teamBId cannot be the same.",
      path: ["teamBId"],
    },
  )
  .refine(
    (data) => {
      if (!hasSavedResult(data)) return true;
      return data.teamAId != null && data.teamBId != null;
    },
    {
      message: SCORES_REQUIRE_TEAMS_MESSAGE,
      path: ["teamAId"],
    },
  )
  .refine(
    (data) => {
      // If isDraw is true, scores must be equal
      if (data.isDraw) {
        if (
          data.teamAScore !== null &&
          data.teamAScore !== undefined &&
          data.teamBScore !== null &&
          data.teamBScore !== undefined &&
          data.teamAScore !== data.teamBScore
        ) {
          return false;
        }
        // winnerId must be null for draws
        if (data.winnerId !== null && data.winnerId !== undefined) {
          return false;
        }
      }
      return true;
    },
    {
      message: "For draws, scores must be equal and no winner can be selected.",
      path: ["isDraw"],
    },
  )
  .refine(
    (data) => {
      // Cannot have draw and forfeit simultaneously
      if (data.isDraw && (data.teamAForfeited || data.teamBForfeited)) {
        return false;
      }
      return true;
    },
    {
      message: "A game cannot be both a draw and have forfeits.",
      path: ["isDraw"],
    },
  )
  .refine(
    (data) => {
      const bothForfeited = data.teamAForfeited && data.teamBForfeited;
      const oneForfeited = data.teamAForfeited || data.teamBForfeited;
      const isDraw = data.isDraw;

      // If both teams forfeited, winnerId must be null and not a draw
      if (bothForfeited) {
        return (
          (data.winnerId === null || data.winnerId === undefined) && !isDraw
        );
      }

      // If draw, winnerId must be null
      if (isDraw) {
        return data.winnerId === null || data.winnerId === undefined;
      }

      // If only one team forfeited, winnerId must be the other team (and must be set)
      if (oneForfeited && !bothForfeited) {
        const expectedWinner = data.teamAForfeited
          ? data.teamBId
          : data.teamAId;
        return data.winnerId === expectedWinner;
      }

      // For normal games (no forfeits), winnerId must be one of the teams or null
      if (
        !oneForfeited &&
        data.winnerId !== null &&
        data.winnerId !== undefined
      ) {
        return data.winnerId === data.teamAId || data.winnerId === data.teamBId;
      }

      return true;
    },
    {
      message:
        "winnerId must be either teamAId, teamBId, or null for unfinished games.",
      path: ["winnerId"],
    },
  );

export const MAX_SCORE_DELTA = 1000;

export const ScoreDeltaSchema = z.object({
  team: z.enum(["A", "B"], { error: "team must be either A or B." }),
  delta: z
    .number({ error: "delta must be a number." })
    .int("delta must be a whole number.")
    .min(-MAX_SCORE_DELTA, `delta cannot be less than -${MAX_SCORE_DELTA}.`)
    .max(MAX_SCORE_DELTA, `delta cannot be more than ${MAX_SCORE_DELTA}.`)
    .refine((delta) => delta !== 0, "delta cannot be 0."),
});

/** Ranks for every participant. Ties are allowed; a null rank is unranked (DNF once finished). */
export const MultiTeamResultSchema = z.object({
  results: z
    .array(
      z.object({
        teamId: z.number({ error: "teamId must be a number." }).int(),
        rank: z
          .number({ error: "rank must be a number." })
          .int("rank must be a whole number.")
          .min(1, "rank must be 1 or more.")
          .nullable(),
      }),
      { error: "results must be a list." },
    )
    .refine(
      (results) => new Set(results.map((r) => r.teamId)).size === results.length,
      { message: "Each team can only be ranked once." },
    ),
});

// Export inferred types
export type AddGamePayload = z.infer<typeof AddGameSchema>;
export type EditGamePayload = z.infer<typeof EditGameSchema>;
export type ScoreDeltaPayload = z.infer<typeof ScoreDeltaSchema>;
export type MultiTeamResultPayload = z.infer<typeof MultiTeamResultSchema>;

export type MatchdayGameStatus = "UPCOMING" | "ONGOING" | null;

export type TodaysGamesSelection = {
  featured: Schedules[];
  compact: Schedules[];
};

// Pagination types
export interface PaginationParams {
  cursor?: string;
  limit?: number;
  offset?: number;
  order?: "asc" | "desc";
}

export interface PaginatedGamesResponse {
  data: Schedules[];
  hasMore: boolean;
  nextCursor: string | null;
}
