/*
  Types for the score, Initialy set to string for all types for testing purposes. Will be changed later to match DB types
*/
export type Scores = {
    id: number,
    startDate: string,
    endDate: string,
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
    id: number,
    gameType: {
        id: number,
        gameName: string,
    }
    team: {
        id: number,
        teamName: string
    },
    startDate: string,
    endDate: string,
    rank: number,
}

export type Schedules = {
    id: number,
    startDate: string,
    endDate: string,
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
    location?: string | undefined,
}

export type filterType = {
    date?: string,
    game?: string,
    teams?: {
        home?: string,
        away?: string,
    },
    finishedGames?: boolean
};