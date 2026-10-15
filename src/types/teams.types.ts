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
    schoolId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'schoolId is required.'
                : 'schoolId must be a number.',
    }),
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
    teamName: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'teamName is required.'
                    : 'teamName must be a string.',
        })
        .min(1, 'teamName cannot be empty.'),
    schoolId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'schoolId is required.'
                : 'schoolId must be a number.',
    }),
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

export type AddTeamPayload = z.infer<typeof AddTeamSchema>;
export type EditTeamPayload = z.infer<typeof EditTeamSchema>;
