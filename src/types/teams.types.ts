import { BaseGet } from "./base.types";

export interface Teams extends BaseGet {
  teams: string[];
}

export interface AddTeamPayload {
  teamName: string;
  schoolIds: number[];
  gameTypeIds: number[];
}

export interface EditTeamPayload {
  id: number;
  schoolIds: number[];
  teamName: string;
  gameTypeIds: number[];
}
