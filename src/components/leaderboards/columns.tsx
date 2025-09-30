import { ColumnDef } from "@tanstack/react-table";
import SportLogo from "@/app/favicon.ico"; 
import Image from "next/image";

// import { sportIcons } from "@/components/schedules/columns";
// import Image from "next/image";

export type SchoolRank = {
  id: number
  schoolName: string
  wins: number
  losses: number
  winPercentage: number
  sport: string
}

export type CustomColumnDef<T> = ColumnDef<T> & {
  meta?: {
    className?: string;
  };
};

export const columns: ColumnDef<SchoolRank>[] = [
  {
    accessorKey: "schoolName",
    header: "TEAM",
    meta: { className: "w-100" },
    cell: ({ row }) => (
    <div className="flex items-center gap-2">
        <Image src={SportLogo} alt="Sport Logo" className="size-6" />
        <span>{row.getValue("schoolName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "wins",
    header: "W",
    meta: { className: "w-16 text-center" },
  },
  {
    accessorKey: "losses",
    header: "L",
    meta: { className: "w-16 text-center" },
  },
  {
    accessorKey: "winPercentage",
    header: "WIN %",
    meta: { className: "w-20 text-center" },
    cell: ({ row }) => {
      const value = row.getValue<number>("winPercentage")
      return `${value.toFixed(2)}%`
    }
  }
]