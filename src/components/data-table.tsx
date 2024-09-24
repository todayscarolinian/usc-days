"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdvancedSearch } from "./advanced-search"; // Import your AdvancedSearch component

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState<any>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [isAdvancedSearchOpen, setAdvancedSearchOpen] = useState(false); // State for dialog visibility

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    state: {
      globalFilter,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  const handleOpenAdvancedSearch = () => {
    setAdvancedSearchOpen(true);
  };

  const handleCloseAdvancedSearch = () => {
    setAdvancedSearchOpen(false);
  };

  return (
    <div className="rounded-md border m-4">
      <div className="p-6 bg-black flex gap-4 justify-between items-center">
        <h1 className="uppercase text-white text-3xl font-semibold">
          USC Days
        </h1>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search teams"
            onChange={e => table.setGlobalFilter(e.target.value)}
            className="max-w-sm" 
          />
          <button
            onClick={handleOpenAdvancedSearch}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Filters
          </button>
        </div>
      </div>

      {/* Advanced Search Dialog */}
      {isAdvancedSearchOpen && (
        <AdvancedSearch onClose={handleCloseAdvancedSearch} />
      )}

      {/* Data table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-6 max-w-[30px]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-6 max-w-[30px]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex flex-col gap-4 items-center justify-center p-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => {
                  table.previousPage();
                }}
              />
            </PaginationItem>

            {Array.from({ length: table.getPageCount() }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={index === table.getState().pagination.pageIndex}
                  onClick={() => table.setPageIndex(index)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => {
                  table.nextPage();
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
