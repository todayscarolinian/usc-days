import { z } from 'zod';

const GameFormatSchema = z.enum(['HEAD_TO_HEAD', 'MULTI_TEAM'], {
    error: 'format must be HEAD_TO_HEAD or MULTI_TEAM.',
});

export const AddGameTypeSchema = z
    .object({
         gameName: z
                .string({
                    error: (issue) =>
                        issue.input === undefined
                            ? 'gameTypeName is required.'
                            : 'gameTypeName must be a string.',
                })
                .min(1, 'gameTypeName cannot be empty.'),
         format: GameFormatSchema.optional(),
         scoringMode: z.enum(['LINEAR', 'SETS']).optional(),
    });

export const EditGameTypeSchema = z
    .object({
         gameName: z
                .string({
                    error: (issue) =>
                        issue.input === undefined
                            ? 'gameTypeName is required.'
                            : 'gameTypeName must be a string.',
                })
                .min(1, 'gameTypeName cannot be empty.'),
         format: GameFormatSchema.optional(),
         scoringMode: z.enum(['LINEAR', 'SETS']).optional(),
    });

export type AddGameTypePayload = z.infer<typeof AddGameTypeSchema>;
export type EditGameTypePayload = z.infer<typeof EditGameTypeSchema>;
