import { BaseGet } from "./base.types";
import { z } from 'zod';

export interface Games extends BaseGet {
    games: string[];
}

export const AddGameSchema = z.object({
    gameTypeId: z.number({
        required_error: "gameTypeId is required.",
        invalid_type_error: "gameTypeId must be a number.",
    }),
    teamAId: z.number({
        required_error: "teamAId is required.",
        invalid_type_error: "teamAId must be a number.",
    }),
    teamBId: z.number({
        required_error: "teamBId is required.",
        invalid_type_error: "teamBId must be a number.",
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
    location: z.string().optional(),
}).refine((data) => data.teamAId !== data.teamBId, {
    message: "teamAId and teamBId cannot be the same.",
    path: ['teamBId'],
});

export const EditGameSchema = z.object({
    id: z.number({
        required_error: "id is required.",
        invalid_type_error: "id must be a number.",
    }),
    gameTypeId: z.number({
        required_error: "gameTypeId is required.",
        invalid_type_error: "gameTypeId must be a number.",
    }),
    teamAId: z.number({
        required_error: "teamAId is required.",
        invalid_type_error: "teamAId must be a number.",
    }),
    teamBId: z.number({
        required_error: "teamBId is required.",
        invalid_type_error: "teamBId must be a number.",
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
    location: z.string().optional(),
}).refine((data) => data.teamAId !== data.teamBId, {
    message: "teamAId and teamBId cannot be the same.",
    path: ['teamBId'],
});

// Schema for DeleteGame
export const DeleteGameSchema = z.object({
    id: z.number({
        required_error: "id is required.",
        invalid_type_error: "id must be a number.",
    }),
});

// Export inferred types
export type AddGamePayload = z.infer<typeof AddGameSchema>;
export type EditGamePayload = z.infer<typeof EditGameSchema>;
export type DeleteGamePayload = z.infer<typeof DeleteGameSchema>;

