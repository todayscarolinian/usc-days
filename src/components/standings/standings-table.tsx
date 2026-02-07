"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Roboto } from "next/font/google";
import { StandingData } from "@/src/types/types";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface DataTableProps {
  columns: ColumnDef<StandingData>[];
  data: StandingData[];
}

export default function DataTable({ columns, data }: DataTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={`border overflow-x-auto ${roboto.className}`}>
      <Table
        className="w-full border-collapse text-sm [&_th]:border-0! [&_td]:border-0! [&_tr]:border-0! [&_thead]:border-0! [&_tbody]:border-0!"
        style={{ borderCollapse: "collapse" }}
      >
        <TableHeader
          className="bg-[#FAFAFA] text-[#080808] [&_tr]:border-0! [&_th]:border-0!"
          style={{ border: "none" }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="h-15 border-0!"
              style={{ border: "none" }}
            >
              {headerGroup.headers.map((header, i) => (
                <TableHead
                  key={header.id}
                  className={`h-15 px-4 font-bold uppercase ${
                    i === 0 ? "w-235.5 text-left" : "w-35.5 text-center"
                  } border-0!`}
                  style={{ border: "none" }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody
          className="text-[#3A3A3A] [&_tr]:border-0! [&_td]:border-0!"
          style={{ border: "none" }}
        >
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="h-15 border-0!"
                style={{ border: "none" }}
              >
                {row.getVisibleCells().map((cell, i) => (
                  <TableCell
                    key={cell.id}
                    className={`h-15 px-4 ${
                      i === 0 ? "w-235.5 text-left" : "w-35.5 text-center"
                    } border-0!`}
                    style={{ border: "none" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="h-15 border-0!" style={{ border: "none" }}>
              <TableCell
                colSpan={columns.length}
                className="h-15 text-center border-0!"
                style={{ border: "none" }}
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
