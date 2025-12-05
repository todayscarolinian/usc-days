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

export type StandingData = {
    id: number;
    team: string;
    wins: number;
    losses: number;
    winPercentage: number;
    sport: string;
};

export type Schedules = {
    id: number;
    startDate: string;
    endDate: string;
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
    teamAScore: number | null;
    teamBScore: number | null;
    location?: string | undefined;
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
