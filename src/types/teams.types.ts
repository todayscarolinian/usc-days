import { BaseGet } from "./base.types";

export interface Teams extends BaseGet {
  teams: string[];
}

export interface AddTeamPayload {
  teamName: string;
  schoolId: number;
  gameTypeIds: number[];
}

export interface EditTeamPayload {
  id: number;
  schoolId: number;
  teamName: string;
  gameTypeIds: number[];
}
