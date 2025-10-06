"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/leaderboards/data-table";
import { columns, SchoolRank } from "@/components/leaderboards/columns";
import { transformGamesToSchoolRank } from "@/components/leaderboards/transformData";
import axios from "axios";

export default function RankingsPage() {
    const [rankingsData, setRankingsData] = useState<SchoolRank[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const {
                    data: { games },
                } = await axios.get("/api/games");
                const transformed = transformGamesToSchoolRank(games);
                setRankingsData(transformed);
            } catch (err) {
                console.error("Error fetching rankings:", err);
                setError("Error fetching rankings");
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error Fetching Data</div>;
    }

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto sm:max-w-360">
                <DataTable
                    columns={columns}
                    data={rankingsData}
                    title="USC DAYS"
                />
            </div>
        </div>
    );
}
