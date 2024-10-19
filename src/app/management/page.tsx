import { sportColumns, SportInfo } from "@/components/sports/columns";
import { SportsDataTable } from "@/components/sports/data-table";
import { teamColumns, TeamInfo } from "@/components/teams/columns";
import { TeamsDataTable } from "@/components/teams/data-table";
import axios from "axios";

type ExtractedData = {
  id: number;
  teamName: string;
  gameTypes: [
    {
      gameType: {
        id: number;
        gameName: string;
      };
    }
  ];
  teamSchools: [
    school: {
      school: {
        id: number;
        schoolName: string;
      };
    }
  ];
};

export default async function Home() {
  const {
    data: { teams: data },
  } = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams");

  const teamsData: TeamInfo[] = data.map((team: ExtractedData) => ({
    id: team.id,
    teamName: team.teamName,
    schools: team.teamSchools.map((school) => ({
      id: school.school.id,
      schoolName: school.school.schoolName,
    })),
  }));

  const sportInfoMap = new Map<number, SportInfo>();

  data.forEach((team: ExtractedData) => {
    team.gameTypes.forEach((gameType) => {
      const gameTypeId = gameType.gameType.id;
      const gameTypeName = gameType.gameType.gameName;

      // If sport exists in map, add team to list
      if (sportInfoMap.has(gameTypeId)) {
        sportInfoMap.get(gameTypeId)?.teams.push({
          id: team.id,
          name: team.teamName,
        });
      } else {
        // else, make new SportInfo entry
        sportInfoMap.set(gameTypeId, {
          id: gameTypeId,
          name: gameTypeName,
          teams: [
            {
              id: team.id,
              name: team.teamName,
            },
          ],
        });
      }
    });
  });

  // Convert map to array
  const sportsData: SportInfo[] = Array.from(sportInfoMap.values());

  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto sm:max-w-[90rem]">
        <div className="grid lg:grid-cols-7 gap-6">
          <div className="lg:col-span-3">
            <TeamsDataTable columns={teamColumns} data={teamsData} />
          </div>
          <div className="lg:col-span-4">
            <SportsDataTable columns={sportColumns} data={sportsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
