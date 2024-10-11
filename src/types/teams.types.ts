import { BaseGet } from "./base.types";
import { z } from 'zod';

export interface Teams extends BaseGet {
  teams: string[];
}

export const AddTeamSchema = z.object({
  teamName: z.string({
    required_error: "teamName is required.",
    invalid_type_error: "teamName must be a string.",
  }).min(1, "teamName cannot be empty."),
  schoolIds: z.array(z.number({
    required_error: "Each schoolId must be a number.",
    invalid_type_error: "schoolIds must be an array of numbers.",
  })).nonempty("schoolIds cannot be empty."),
  gameTypeIds: z.array(z.number({
    required_error: "Each gameTypeId must be a number.",
    invalid_type_error: "gameTypeIds must be an array of numbers.",
  })).nonempty("gameTypeIds cannot be empty."),
});

export const EditTeamSchema = z.object({
  id: z.number({
    required_error: "id is required.",
    invalid_type_error: "id must be a number.",
  }),
  teamName: z.string({
    required_error: "teamName is required.",
    invalid_type_error: "teamName must be a string.",
  }).min(1, "teamName cannot be empty."),
  schoolIds: z.array(z.number({
    required_error: "Each schoolId must be a number.",
    invalid_type_error: "schoolIds must be an array of numbers.",
  })).nonempty("schoolIds cannot be empty."),
  gameTypeIds: z.array(z.number({
    required_error: "Each gameTypeId must be a number.",
    invalid_type_error: "gameTypeIds must be an array of numbers.",
  })).nonempty("gameTypeIds cannot be empty."),
});

export const DeleteTeamSchema = z.object({
  id: z.number({
    required_error: "id is required.",
    invalid_type_error: "id must be a number.",
  }),
});

export type AddTeamPayload = z.infer<typeof AddTeamSchema>;
export type EditTeamPayload = z.infer<typeof EditTeamSchema>;
export type DeleteTeamPayload = z.infer<typeof DeleteTeamSchema>;
