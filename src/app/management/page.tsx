import { sportColumns, sportMockData } from "@/components/sports/columns";
import { SportsDataTable } from "@/components/sports/data-table";
import { teamColumns, teamMockData } from "@/components/teams/columns";
import { TeamsDataTable } from "@/components/teams/data-table";

export default function Home() {
	return (
		<div className="p-4 sm:py-10">
			<div className="mx-auto sm:max-w-[90rem]">
				<div className="grid lg:grid-cols-7 gap-6">
					<div className="lg:col-span-3">
						<TeamsDataTable
							columns={teamColumns}
							data={teamMockData}
						/>
					</div>
					<div className="lg:col-span-4">
						<SportsDataTable
							columns={sportColumns}
							data={sportMockData}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
