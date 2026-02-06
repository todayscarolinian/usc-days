import { z } from 'zod';
import { Schedules } from './types';

export const AddGameSchema = z
    .object({
        gameTypeId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'Please select a sport.'
                    : 'Sport selection is invalid.',
        }),
        teamAId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'Please select the first team.'
                    : 'First team selection is invalid.',
        }),
        teamBId: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'Please select the second team.'
                    : 'Second team selection is invalid.',
        }),
        startDate: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? 'Start date is required.'
                        : 'Start date must be a valid date.',
            })
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Please enter a valid start date.',
            }),
        endDate: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? 'End date is required.'
                        : 'End date must be a valid date.',
            })
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Please enter a valid end date.',
            }),
        location: z.string().optional(),
        createdById: z.number({
            error: (issue) =>
                issue.input === undefined
                    ? 'User authentication is required.'
                    : 'User authentication is invalid.',
        }),
    })
    .refine((data) => data.teamAId !== data.teamBId, {
        message: 'Please select two different teams.',
        path: ['teamBId'],
    })
    .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
        message: 'End date must be on or after start date.',
        path: ['endDate'],
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
            .min(-1, 'teamAScore cannot be negative.')
            .nullable()
            .optional(),
        teamBScore: z
            .number({
                error: (issue) =>
                    issue.input === undefined
                        ? 'teamBScore is required.'
                        : 'teamBScore must be a number.',
            })
            .min(-1, 'teamBScore cannot be negative.')
            .nullable()
            .optional(),
        winnerId: z
            .number({
                error: (issue) =>
                    issue.input === undefined
                        ? 'winnerId is required.'
                        : 'winnerId must be a number.',
            })
            .nullable()
            .optional(),
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
    })
    .refine((data) => {
        if (data.winnerId !== null && data.winnerId !== undefined) {
            return data.winnerId === data.teamAId || data.winnerId === data.teamBId;
        }
        return true;
    }, {
        message: 'winnerId must be either teamAId, teamBId, or null for unfinished games.',
        path: ['winnerId'],
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

// Pagination types
export interface PaginationParams {
    cursor?: string;
    limit?: number;
    offset?: number;
}

export interface PaginatedGamesResponse {
    games: Schedules[];
    hasMore: boolean;
    nextCursor: string | null;
    count: number;
    total?: number;
}