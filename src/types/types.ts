import { Game } from "../lib/prisma/generated/client";

/*
  Types for the score, Initialy set to string for all types for testing purposes. Will be changed later to match DB types
*/
export type Games = {
    id: number;
    startDate: string;
    endDate: string;
    gameTypeId: number;
    teamAId: number;
    teamBId: number;
    teamAScore: number | null;
    teamBScore: number | null;
    location?: string | null;
    winnerId?: number | null;
    createdAt?: string;
    createdBy?: number;
};

export type Champions = {
    id: number;
    gameType: {
        id: number;
        gameName: string;
    };
    team: {
        id: number;
        teamName: string;
    };
    startDate: string;
    endDate: string;
    rank: number;
};

export type StandingData = {
    id: number;
    team: string;
    wins: number;
    losses: number;
    winPercentage: number;
    sport: string;
};

export type Schedules = Game & {
    gameType: {
        id: number;
        gameName: string;
    };
    teamA: {
        id: number;
        teamName: string;
    };
    teamB: {
        id: number;
        teamName: string;
    };
    winner: {
        id: number;
        teamName: string;
    } | null;
};

export type filterType = {
    date?: string;
    game?: string;
    teams?: {
        home?: string;
        away?: string;
    };
    finishedGames?: boolean;
};
