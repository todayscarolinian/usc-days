"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
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
import { AdvancedSearch } from "@/components/Scores/advanced-search";
import { useFilter } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";
import { userMockData } from "@/constants/mockData";
import { FaRegEdit } from "react-icons/fa";
import AddScoreDialog from "./add-score-dialog";
import { Dialog, DialogTrigger } from "../ui/dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // Column filter state
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "date",
      desc: true,
    }
  ]) 
  const filters = useFilter();

  const [openDialog, setOpenDialog] = useState(false);
  let [selectedRecord, setSelectedRecord] = useState(null);

  const toggleDialog = (open: boolean, data: any) => {
    setOpenDialog(open);
    setSelectedRecord(data);
  }

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
      sorting
    },
  });

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
          {/* Filter button, To be added: clear filters */}
          <AdvancedSearch />
          {/* Clear filter */}
          {filters.isFilterActive && (
            <Button onClick={filters.clearFilter}>Clear Filter</Button>
          )}
        </div>
      </div>

      {/* Data table, To be added: Actions column when staff authenticated */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              {userMockData.role === "staff" ? (
                <TableHead className="p-6">
                  <span className="font-bold sm:text-lg">Action</span>
                </TableHead>
              ) : (
                ""
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-none">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {/* Staff authenticated show edit button - Once clicked, dialog for Score submission will appear*/}
                {userMockData.role === "staff" ? (
                  <TableCell className="p-6">
                    <Dialog>
                      <DialogTrigger onClick={() => toggleDialog(true, row.original)} className="text-primary-foreground bg-[#9B2626] hover:bg-[#771D1D] h-9 rounded-md px-3">
                        <FaRegEdit />
                      </DialogTrigger>
                    </Dialog>
                  </TableCell>
                ) : (
                  ""
                )}
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

      <AddScoreDialog
        isOpen={openDialog}
        selectedRecord={selectedRecord}
        onCancel={() => toggleDialog(false, null)}
        onSave={() => toggleDialog(false, null)}
      />
    </div>
  );
}
