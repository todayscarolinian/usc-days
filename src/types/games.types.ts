import { z } from 'zod';

export const AddGameSchema = z
    .object({
        gameTypeId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'gameTypeId is required.'
                    : 'gameTypeId must be a number.',
        }),
        teamAId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamAId is required.'
                    : 'teamAId must be a number.',
        }),
        teamBId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamBId is required.'
                    : 'teamBId must be a number.',
        }),
        startDate: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? 'startDate is required.'
                        : 'startDate must be a valid ISO date string.',
            })
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid date format for startDate. Use ISO format.',
            }),
        endDate: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? 'endDate is required.'
                        : 'endDate must be a valid ISO date string.',
            })
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid date format for endDate. Use ISO format.',
            }),
        location: z.string().optional(),
        createdById: z
            .number({
                error: (issue) =>
                    issue.input === undefined
                        ? 'createdById is required.'
                        : 'createdById must be a number.',
        }),
    })
    .refine((data) => data.teamAId !== data.teamBId, {
        message: 'teamAId and teamBId cannot be the same.',
        path: ['teamBId'],
    });

export const EditGameSchema = z
    .object({
        id: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'id is required.'
                    : 'id must be a number.',
        }),
        gameTypeId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'gameTypeId is required.'
                    : 'gameTypeId must be a number.',
        }),
        teamAId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamAId is required.'
                    : 'teamAId must be a number.',
        }),
        teamBId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamBId is required.'
                    : 'teamBId must be a number.',
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
        winnerId: z
            .number({
                error: (issue) =>
                    issue.input === undefined
                        ? 'winnerId is required.'
                        : 'winnerId must be a number.',
        }),
        startDate: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? 'startDate is required.'
                        : 'startDate must be a valid ISO date string.',
            })
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid date format for startDate. Use ISO format.',
            }),
        endDate: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? 'endDate is required.'
                        : 'endDate must be a valid ISO date string.',
            })
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid date format for endDate. Use ISO format.',
            }),
        location: z.string().optional(),
    })
    .refine((data) => data.teamAId !== data.teamBId, {
        message: 'teamAId and teamBId cannot be the same.',
        path: ['teamBId'],
    });

// Schema for DeleteGame
export const DeleteGameSchema = z.object({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'id is required.'
                : 'id must be a number.',
    }),
});

// Export inferred types
export type AddGamePayload = z.infer<typeof AddGameSchema>;
export type EditGamePayload = z.infer<typeof EditGameSchema>;
export type DeleteGamePayload = z.infer<typeof DeleteGameSchema>;
