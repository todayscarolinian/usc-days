import { z } from 'zod';

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
    });

export type AddGameTypePayload = z.infer<typeof AddGameTypeSchema>;
export type EditGameTypePayload = z.infer<typeof EditGameTypeSchema>;