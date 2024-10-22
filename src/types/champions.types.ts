import { z } from 'zod';

export const AddChampionSchema = z.object({
    gameTypeId: z.number({
        required_error: "gameTypeId is required.",
        invalid_type_error: "gameTypeId must be a number.",
    }),
    teamId: z.number({
        required_error: "teamId is required.",
        invalid_type_error: "teamId must be a number.",
    }),
    startDate: z.string({
        required_error: "startDate is required.",
        invalid_type_error: "startDate must be a valid ISO date string.",
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for startDate. Use ISO format.",
    }),
    endDate: z.string({
        required_error: "endDate is required.",
        invalid_type_error: "endDate must be a valid ISO date string.",
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for endDate. Use ISO format.",
    }),
    rank: z.number({
        required_error: "rank is required.",
        invalid_type_error: "rank must be a number",
        
    }).refine((data) => data >= 1 && data <= 3, {
        message: "rank must be between 1 and 3,",
    }), 
})

export const EditChampionSchema = z.object({
    id: z.number({
        required_error: "id is required.",
        invalid_type_error: "id must be a number.",
    }),
    gameTypeId: z.number({
        required_error: "gameTypeId is required.",
        invalid_type_error: "gameTypeId must be a number.",
    }),
    teamId: z.number({
        required_error: "teamAId is required.",
        invalid_type_error: "teamAId must be a number.",
    }),
    startDate: z.string({
        required_error: "startDate is required.",
        invalid_type_error: "startDate must be a valid ISO date string.",
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for startDate. Use ISO format.",
    }),
    endDate: z.string({
        required_error: "endDate is required.",
        invalid_type_error: "endDate must be a valid ISO date string.",
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for endDate. Use ISO format.",
    }),
    rank: z.number({
        required_error: "rank is required.",
        invalid_type_error: "rank must be a number",
        
    }).refine((data) => data >= 1 && data <= 3, {
        message: "rank must be between 1 and 3,",
    }), 
});

// Schema for DeleteGame
export const DeleteChampionSchema = z.object({
    id: z.number({
        required_error: "id is required.",
        invalid_type_error: "id must be a number.",
    }),
});

// Export inferred types
export type AddChampionPayload = z.infer<typeof AddChampionSchema>;
export type EditChampionPayload = z.infer<typeof EditChampionSchema>;
export type DeleteChampionPayload = z.infer<typeof DeleteChampionSchema>;

