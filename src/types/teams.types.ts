import { z } from 'zod';

export const AddTeamSchema = z.object({
    teamName: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamName is required.'
                    : 'teamName must be a string.',
        })
        .min(1, 'teamName cannot be empty.'),
    schoolIds: z
        .array(
            z.number({
                error: (issue) =>
                    issue.input === undefined
                        ? 'Each schoolId must be a number.'
                        : 'schoolIds must be an array of numbers.',
            })
        )
        .nonempty('schoolIds cannot be empty.'),
    gameTypeIds: z
        .array(
            z.number({
                error: (issue) =>
                    issue.input === undefined
                        ? 'Each gameTypeId must be a number.'
                        : 'gameTypeIds must be an array of numbers.',
            })
        )
        .nonempty('gameTypeIds cannot be empty.'),
});

export const EditTeamSchema = z.object({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'id is required.'
                : 'id must be a number.',
    }),
    teamName: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamName is required.'
                    : 'teamName must be a string.',
        })
        .min(1, 'teamName cannot be empty.'),
    schoolIds: z
        .array(
            z.number({
                error: (issue) =>
                    issue.input === undefined
                        ? 'Each schoolId must be a number.'
                        : 'schoolIds must be an array of numbers.',
            })
        )
        .nonempty('schoolIds cannot be empty.'),
    gameTypeIds: z
        .array(
            z.number({
                error: (issue) =>
                    issue.input === undefined
                        ? 'Each gameTypeId must be a number.'
                        : 'gameTypeIds must be an array of numbers.',
            })
        )
        .nonempty('gameTypeIds cannot be empty.'),
});

export const DeleteTeamSchema = z.object({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'id is required.'
                : 'id must be a number.',
    }),
});

export type AddTeamPayload = z.infer<typeof AddTeamSchema>;
export type EditTeamPayload = z.infer<typeof EditTeamSchema>;
export type DeleteTeamPayload = z.infer<typeof DeleteTeamSchema>;
