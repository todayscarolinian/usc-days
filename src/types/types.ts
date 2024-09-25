/*
  Types for the score, Initialy set to string for all types for testing purposes. Will be changed later to match DB types
*/
export type Scores = {
  id: number,
  date: string,
  sport: string,
  teams: {
    home: string,
    away: string,
  },
  scores: {
    home: number,
    away: number,
  },
  winner: string,
}

export type Champions = {
  id: string,
  sport: string,
  team: string,
}

export type filterType = {
  date: string,
  game: string,
  teams: {
    home: string,
    away: string,
  }
};