import { z } from 'zod';

export const AddScoreSchema = z.object({
    gameId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'gameId is required.'
                : 'gameId must be a number.',
    }),
    teamAScore: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamAScore is required.'
                    : 'teamAScore must be a number.',
        })
        .min(-1, 'teamAScore cannot be negative.'),
    teamBScore: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamBScore is required.'
                    : 'teamBScore must be a number.',
        })
        .min(-1, 'teamBScore cannot be negative.'),
    createdById: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'createdById is required.'
                : 'createdById must be a number.',
    }),
});

export const EditScoreSchema = z.object({
    gameId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'gameId is required.'
                : 'gameId must be a number.',
    }),
    teamAScore: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamAScore is required.'
                    : 'teamAScore must be a number.',
        })
        .min(-1, 'teamAScore cannot be negative.'),
    teamBScore: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamBScore is required.'
                    : 'teamBScore must be a number.',
        })
        .min(-1, 'teamBScore cannot be negative.'),
});

export const DeleteScoreSchema = z.object({
    gameId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'gameId is required.'
                : 'gameId must be a number.',
    }),
});

export type AddScorePayload = z.infer<typeof AddScoreSchema>;
export type EditScorePayload = z.infer<typeof EditScoreSchema>;
export type DeleteScorePayload = z.infer<typeof DeleteScoreSchema>;
