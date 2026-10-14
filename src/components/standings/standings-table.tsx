"use client";

import {
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
import standingColumns from "./columns";
import type { TeamStandingData } from "./transformTeamsData";

type StandingsTableProps = {
  data: TeamStandingData[];
  sportName: string;
};

export default function StandingsTable({
  data,
  sportName,
}: StandingsTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: standingColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="border border-neutral-300 bg-white p-4 sm:p-5">
      <header className="mb-4 border-l-4 border-tc_primary pl-3">
        <h2 className="text-lg font-bold uppercase text-neutral-950">
          {sportName || "Standings"}
        </h2>
      </header>

      <div className="overflow-x-auto border border-neutral-300">
        <Table className="min-w-160 text-xs sm:text-sm">
          <TableHeader className="bg-neutral-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-neutral-300 hover:bg-neutral-200"
              >
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={
                      index === 1
                        ? "h-10 px-4 text-left text-[11px] font-bold uppercase text-neutral-700"
                        : "h-10 px-3 text-center text-[11px] font-bold uppercase text-neutral-700"
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-neutral-300 odd:bg-white even:bg-neutral-100 hover:bg-neutral-200"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={
                        index === 1
                          ? "h-12 px-4 text-left"
                          : "h-12 px-3 text-center font-medium"
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={standingColumns.length}
                  className="h-24 text-center text-neutral-500"
                >
                  No completed games for this sport yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="mt-3 text-[11px] italic text-neutral-500">
        Records are calculated from completed tournament games.
      </p>
    </section>
  );
}






// "use client";

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/src/components/ui/table";
// import { Roboto } from "next/font/google";
// import { StandingData } from "@/src/types/types";

// const roboto = Roboto({
//   subsets: ["latin"],
//   weight: ["400", "500", "700"],
// });

// interface DataTableProps {
//   columns: ColumnDef<StandingData>[];
//   data: StandingData[];
// }

// export default function DataTable({ columns, data }: DataTableProps) {
//   // eslint-disable-next-line react-hooks/incompatible-library
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <div className={`border overflow-x-auto ${roboto.className}`}>
//       <Table
//         className="w-full border-collapse text-sm [&_th]:border-0! [&_td]:border-0! [&_tr]:border-0! [&_thead]:border-0! [&_tbody]:border-0!"
//         style={{ borderCollapse: "collapse" }}
//       >
//         <TableHeader
//           className="bg-[#FAFAFA] text-[#080808] [&_tr]:border-0! [&_th]:border-0!"
//           style={{ border: "none" }}
//         >
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow
//               key={headerGroup.id}
//               className="h-15 border-0!"
//               style={{ border: "none" }}
//             >
//               {headerGroup.headers.map((header, i) => (
//                 <TableHead
//                   key={header.id}
//                   className={`h-15 px-4 font-bold uppercase ${
//                     i === 0 ? "w-235.5 text-left" : "w-35.5 text-center"
//                   } border-0!`}
//                   style={{ border: "none" }}
//                 >
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>

//         <TableBody
//           className="text-[#3A3A3A] [&_tr]:border-0! [&_td]:border-0!"
//           style={{ border: "none" }}
//         >
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow
//                 key={row.id}
//                 className="h-15 border-0!"
//                 style={{ border: "none" }}
//               >
//                 {row.getVisibleCells().map((cell, i) => (
//                   <TableCell
//                     key={cell.id}
//                     className={`h-15 px-4 ${
//                       i === 0 ? "w-235.5 text-left" : "w-35.5 text-center"
//                     } border-0!`}
//                     style={{ border: "none" }}
//                   >
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow className="h-15 border-0!" style={{ border: "none" }}>
//               <TableCell
//                 colSpan={columns.length}
//                 className="h-15 text-center border-0!"
//                 style={{ border: "none" }}
//               >
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
