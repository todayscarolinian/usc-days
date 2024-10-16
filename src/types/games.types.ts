import { BaseGet } from "./base.types";

export interface Games extends BaseGet {
  games: string[];
}

export interface AddGamePayload {
    gameTypeId: number;
    teamAId: number;
    teamBId: number;
    date: string;
    location?: string;
}

export interface EditGamePayload {
    id: number;
    gameTypeId: number;
    teamAId: number;
    teamBId: number;
    date: string;
    location?: string;
}
