import { z } from "zod";

export const AddMerchCategorySchema = z.object({
    name: z.string({
        error: (issue) =>
            issue.input === undefined
                ? "name is required."
                : "name must be a string.",
    }),
    imgUrl: z.string({
        error: (issue) =>
            issue.input === undefined
                ? "imgUrl is required."
                : "imgUrl must be a string.",
    }).min(1, "imgUrl cannot be empty."),
});

export const EditMerchCategorySchema = AddMerchCategorySchema.extend({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? "id is required."
                : "id must be a number.",
    }),
});

export const DeleteMerchCategorySchema = z.object({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? "id is required."
                : "id must be a number.",
    }),
});

export type AddMerchCategoryPayload = z.infer<typeof AddMerchCategorySchema>;
export type EditMerchCategoryPayload = z.infer<typeof EditMerchCategorySchema>;
export type DeleteMerchCategoryPayload = z.infer<typeof DeleteMerchCategorySchema>;