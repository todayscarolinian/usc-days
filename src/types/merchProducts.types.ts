/**
 * Create products.types.ts with AddProductSchema including: categoryId (number with custom errors), title (non-empty string), size (nullable string), price (number, positive via .positive()), isAvailable (boolean), imgUrls (string array, non-empty via .min(1)), designers (nullable string array)
Create products.types.ts with EditProductSchema extending AddProductSchema with required id field
Create products.types.ts with DeleteProductSchema containing only id field
Export inferred types: AddProductPayload, EditProductPayload, DeleteProductPayload using z.infer
Create categories.types.ts with AddCategorySchema including: name (string, non-empty), imgUrl (string, non-empty)
Create categories.types.ts with EditCategorySchema with id and all AddCategory fields
Create categories.types.ts with DeleteCategorySchema with id only
Export inferred types: AddCategoryPayload, EditCategoryPayload, DeleteCategoryPayload
Add refinement to ProductSchemas ensuring imgUrls array is not empty and contains valid strings
Follow error message pattern: error: (issue) => issue.input === undefined ? 'field is required.' : 'field must be type.'
 */

import { z } from "zod";

export const AddMerchProductSchema = z.object({
    categoryId: z.number({
        error: (issue) =>
            issue.input === undefined
                ? "categoryId is required."
                : "categoryId must be a number.",
    }),
    title: z.string({
        error: (issue) =>
            issue.input === undefined
                ? "title is required."
                : "title must be a string.",
    }).min(1, "title cannot be empty."),
    size: z.string({
        error: (issue) =>
            issue.input === undefined
                ? "size is required."
                : "size must be a string.",
    }).nullable(),
    price: z.number({
        error: (issue) =>
            issue.input === undefined
                ? "price is required."
                : "price must be a number.",
    }).positive("price must be a positive number."),
    isAvailable: z.boolean({
        error: (issue) =>
            issue.input === undefined
                ? "isAvailable is required."
                : "isAvailable must be a boolean.",
    }),
    imgUrls: z.array(z.string({
        error: (issue) =>
            issue.input === undefined
                ? "imgUrl is required."
                : "imgUrl must be a string.",
    })).min(1, "imgUrls must contain at least one URL."),
    designers: z.array(z.string({
        error: (issue) =>
            issue.input === undefined
                ? "designer is required."
                : "designer must be a string.",
    })).nullable(),
});

export const EditMerchProductSchema = AddMerchProductSchema.extend({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? "id is required."
                : "id must be a number.",
    }),
});

export const DeleteMerchProductSchema = z.object({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? "id is required."
                : "id must be a number.",
    }),
});

// replace with actual category type when available
export type ProductWithCategory = 
{
    id: number;
    categoryId: number;
    title: string;
    size: string | null;
    price: number;
    isAvailable: boolean;
    imgUrls: string[];
    designers: string[] | null;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: number;
        name: string;
        imgUrl: string;
        createdAt: Date;
        updatedAt: Date;
    };
};

export type AddMerchProductPayload = z.infer<typeof AddMerchProductSchema>;
export type EditMerchProductPayload = z.infer<typeof EditMerchProductSchema>;
export type DeleteMerchProductPayload = z.infer<typeof DeleteMerchProductSchema>;