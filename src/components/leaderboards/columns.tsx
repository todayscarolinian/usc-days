import { ColumnDef } from "@tanstack/react-table";
import SportLogo from "@/src/assets/tc-logo-red.png";
import Image from "next/image";
import { StandingData } from "@/src/types/types";

export type CustomColumnDef<T> = ColumnDef<T> & {
  meta?: {
    className?: string;
  };
};

export const columns: ColumnDef<StandingData>[] = [
  {
    accessorKey: "team",
    header: "TEAM",
    meta: { className: "w-100" },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image src={SportLogo} alt="Sport Logo" className="size-6" />
        <span>{row.getValue("team")}</span>
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
      const value = row.getValue<number>("winPercentage");
      return `${value.toFixed(2)}%`;
    },
  },
];
