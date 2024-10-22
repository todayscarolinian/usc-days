"use client";

import { DataTable } from "@/components/champions/champions-table";
import { championColumns } from "@/components/champions/columns";
import AddChampionDialog from "@/components/champions/add-champion-dialog";
import { Champions } from "@/types/types";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ChampionsPage() {
    const [championsData, setChampionsData] = useState<Champions[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChampionsData = async () => {
            try {
                const { data: {champions: fetchedChampionsData} } = await axios.get("/api/champions");
                console.log(fetchedChampionsData);

                setChampionsData(fetchedChampionsData);
            } catch (err) {
                console.error("Error fetching champions data:", err);
                setError("Failed to load champions data");
            } finally {
                setLoading(false);
            }
        };

        fetchChampionsData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto sm:max-w-[90rem]">
                <DataTable
                    columns={championColumns}
                    data={championsData}
                    actionButton={<AddChampionDialog />}
                />
            </div>
        </div>
    );
}
