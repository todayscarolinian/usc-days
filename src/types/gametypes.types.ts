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
        id: z.number({
                    error: (issue) =>
                        issue.input === undefined
                            ? 'id is required.'
                            : 'id must be a number.',
                }),

         gameName: z
                .string({
                    error: (issue) =>
                        issue.input === undefined
                            ? 'gameTypeName is required.'
                            : 'gameTypeName must be a string.',
                })
                .min(1, 'gameTypeName cannot be empty.'),
    });

export const DeleteGameTypeSchema = z 
    .object({
        id: z.number({
                    error: (issue) =>
                        issue.input === undefined
                            ? 'id is required.'
                            : 'id must be a number.',
                }),
    });

export type AddGameTypePayload = z.infer<typeof AddGameTypeSchema>;
export type EditGameTypePayload = z.infer<typeof EditGameTypeSchema>;
export type DeleteGameTypePayload = z.infer<typeof DeleteGameTypeSchema>;