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

// PUT is a full replacement, so it takes the same fields as create.
// The id comes from the URL path, never the body.
export const EditMerchCategorySchema = AddMerchCategorySchema;

export type AddMerchCategoryPayload = z.infer<typeof AddMerchCategorySchema>;
export type EditMerchCategoryPayload = z.infer<typeof EditMerchCategorySchema>;