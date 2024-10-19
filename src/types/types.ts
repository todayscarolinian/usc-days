/*
  Types for the score, Initialy set to string for all types for testing purposes. Will be changed later to match DB types
*/
export type Scores = {
    id: number,
    startDate: string,
    gameType: {
        id: number,
        gameName: string,
    },
    teamA: {
        id: number,
        teamName: string,
    }
    teamB: {
        id: number,
        teamName: string,
    },
    score: {
        teamAScore: number,
        teamBScore: number,
    },
    winner: string,
}

export type Champions = {
    id: string,
    sport: string,
    team: string,
}

export type Schedules = {
    id: number,
    startDate: string,
    gameType: {
        id: number,
        gameName: string,
    },
    teamA: {
        id: number,
        teamName: string,
    }
    teamB: {
        id: number,
        teamName: string,
    },
    score: {
        teamAScore: number,
        teamBScore: number,
    } | null,
    location: string,
}

export type filterType = {
    date?: string,
    game?: string,
    teams?: {
        home?: string,
        away?: string,
    }
};