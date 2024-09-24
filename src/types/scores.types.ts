import { Users } from "./users.types";

export interface Score {
  gameId: number;
  teamAScore: number;
  teamBScore: number;
  createdBy: Users;
}
