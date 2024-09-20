"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Scores } from "@/types/types"
import { Champions } from "@/types/types"

export const scoreColumns: ColumnDef<Scores>[] = [
  {
    accessorKey: "date",
    header: () => <span className="font-bold">Date</span>,
  },
  {
    accessorKey: "sport",
    header: () => <span className="font-bold">Sport</span>,
  },
  {
    accessorKey: "teams",
    header: () => <span className="font-bold">Teams</span>,
  },
  {
    accessorKey: "score",
    header: () => <span className="font-bold">Score</span>,
  },
  {
    accessorKey: "winner",
    header: () => <span className="font-bold">Winner</span>,
  },
]

export const championColumns: ColumnDef<Champions>[] = [
  {
    accessorKey: "sport",
    header: () => <span>Sport</span>
  },
  {
    accessorKey: "team",
    header: () => <span>Team</span>
  }
]