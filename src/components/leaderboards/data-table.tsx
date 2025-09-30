"use client"
import React, { useState } from "react"
import {
  // ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { CustomColumnDef } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: CustomColumnDef<TData>[];
  data: TData[]
  title?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title = "USC DAYS",
}: DataTableProps<TData, TValue>) {
  const [keyword, setKeyword] = useState("")

  const filteredData = React.useMemo(() => {
    if (!keyword.trim()) return []
    return data
      .filter((row: any) =>
        row.sport.toLowerCase().includes(keyword.toLowerCase())
      )
      .slice()
      .sort((a: any, b: any) => b.winPercentage - a.winPercentage)
  }, [keyword, data])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="rounded-md border">
      <div className="p-6 bg-black flex gap-4 justify-between items-center">
        
        <h1 className="uppercase text-white text-2xl font-bold">{title}</h1>

        <Input
          placeholder="Keyword Search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="max-w-sm bg-black text-white"
        />
      </div>

      {/* Data table */}
      <Table>
        {table.getRowModel().rows?.length > 0 && (
          <TableHeader className="bg-gray text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={`p-4 md:p-6 font-bold bg-gray-50 ${header.column.columnDef.meta?.className ?? ""}`}>
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
        )}

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-none">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={`p-4 md:p-6 ${cell.column.columnDef.meta?.className ?? ""}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No Records Found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}