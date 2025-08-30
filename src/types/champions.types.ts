import { z } from 'zod';

export const AddChampionSchema = z.object({
    gameTypeId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'gameTypeId is required.'
                : 'gameTypeId must be a number.',
    }),
    teamId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'teamId is required.'
                : 'teamId must be a number.',
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
    rank: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? 'rank is required.'
                    : 'rank must be a number.',
        })
        .refine((data) => data >= 1 && data <= 3, {
            message: 'rank must be between 1 and 3.',
        }),
});

export const EditChampionSchema = z.object({
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
    teamId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'teamId is required.'
                : 'teamId must be a number.',
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
    rank: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? 'rank is required.'
                    : 'rank must be a number.',
        })
        .refine((data) => data >= 1 && data <= 3, {
            message: 'rank must be between 1 and 3.',
        }),
});

// Schema for DeleteGame
export const DeleteChampionSchema = z.object({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'id is required.'
                : 'id must be a number.',
    }),
});

// Export inferred types
export type AddChampionPayload = z.infer<typeof AddChampionSchema>;
export type EditChampionPayload = z.infer<typeof EditChampionSchema>;
export type DeleteChampionPayload = z.infer<typeof DeleteChampionSchema>;
