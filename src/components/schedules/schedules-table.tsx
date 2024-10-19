"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
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
import { AdvancedSearch } from "@/components/schedules/advanced-search";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { useFilterStore } from "@/stores/filter-store";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showFilter?: boolean;
  actionButton?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showFilter = true,
  actionButton = null,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{
    id: "status",
    value: ""
  }]); // Column filter state
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "date",
      desc: true,
    },
  ]);
  
  const filters = useFilterStore();

  useEffect(() => {

    const newFilters: ColumnFiltersState = [];

    // Filters for date
    if (filters.date) {
      newFilters.push({ id: "date", value: filters.date });
    }

    // Filters for games
    if (filters.game) {
      newFilters.push({ id: "game", value: filters.game });
    }

    // Flattened string for teams
    if (filters.teams.home && filters.teams.away) {
      const teamsString = `${filters.teams.home} vs ${filters.teams.away}`;
      newFilters.push({ id: "teams", value: teamsString });
    } else if (filters.teams.home) {
      newFilters.push({ id: "teams", value: filters.teams.home });
    } else if (filters.teams.away) {
      newFilters.push({ id: "teams", value: filters.teams.away });
    }

    // Add the status filter based on the checkbox state
    newFilters.push({ id: "status", value: filters.finishedGames });

    setColumnFilters(newFilters);
  }, [filters]);

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
    onSortingChange: setSorting,
    globalFilterFn: "includesString",
    state: {
      globalFilter,
      columnFilters,
      pagination,
      sorting,
    },
  });

  const { email } = useUserStore();

  return (
    <div className="rounded-md border">
      <div className="p-6 bg-black flex gap-4 justify-between items-center">
        <h1 className="uppercase text-white text-3xl font-bold">USC Days</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Keyword Search"
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          {/* Filter button */}
          {showFilter && <AdvancedSearch />}
          {/* Clear filter */}
          {showFilter && filters.isFilterActive && (
            <Button onClick={filters.clearFilter}>Clear Filter</Button>
          )}
          {email && actionButton && actionButton}
        </div>
      </div>

      {/* Data table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`p-4 md:p-6 ${
                        header.id == "winner" && "hidden md:block"
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                {email ? (
                  <TableHead className="p-4">
                    <span className="font-bold sm:text-lg">Action</span>
                  </TableHead>
                ) : (
                  ""
                )}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-none">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      className={`p-4 md:p-6 ${
                        cell.id.includes("winner") && "hidden md:block"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
                {/* Staff authenticated show edit button - Once clicked, dialog for Score submission will appear*/}
                {/* Dialog */}
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
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => {
                  if (table.getState().pagination.pageIndex > 0) {
                    table.previousPage();
                  }
                }}
                className={
                  table.getState().pagination.pageIndex === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              />
            </PaginationItem>
            {/* Page count */}
            {Array.from({ length: table.getPageCount() }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={index === table.getState().pagination.pageIndex}
                  onClick={() => table.setPageIndex(index)}
                  className={`px-4 py-2 rounded-md ${
                    index === table.getState().pagination.pageIndex
                      ? "border-[#9B2626]"
                      : "border-none"
                  }`}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => {
                  if (
                    table.getState().pagination.pageIndex <
                    table.getPageCount() - 1
                  ) {
                    table.nextPage();
                  }
                }}
                className={
                  table.getState().pagination.pageIndex ===
                  table.getPageCount() - 1
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

    </div>
  );
}
