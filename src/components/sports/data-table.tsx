"use client";

import {
  ColumnDef,
  flexRender,
  PaginationState,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function SportsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="rounded-md border">
      <div className="p-6 bg-black flex gap-4 justify-between items-center">
        <h1 className="uppercase text-white text-3xl font-bold">Sports</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Keyword Search"
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-sm text-white"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-4 md:p-6">
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-4 md:p-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex flex-col gap-4 items-center justify-center p-4">
        <Pagination>
          <PaginationContent>
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
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

            {/* Page numbers */}
            {(() => {
              const { pageIndex } = table.getState().pagination;
              const pageCount = table.getPageCount() - 1;
              const maxVisiblePages = 2;

              let startPage = Math.max(0, pageIndex - 1);
              let endPage = Math.min(pageCount, pageIndex + 2);

              if (endPage - startPage < maxVisiblePages) {
                startPage = Math.max(0, endPage - maxVisiblePages);
              }

              const pages = Array.from(
                { length: endPage - startPage },
                (_, i) => startPage + i
              );

              return pages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === pageIndex}
                    onClick={(event) => {
                      event.preventDefault();
                      table.setPageIndex(page);
                    }}
                    className={`px-4 py-2 rounded-md ${
                      page === table.getState().pagination.pageIndex
                        ? "border-[#9B2626]"
                        : "border-none"
                    }`}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ));
            })()}

            {/* Ellipsis and page input */}
            {table.getState().pagination.pageIndex !==
              table.getPageCount() - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Display Last Page index here */}
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={table.getState().pagination.pageIndex === table.getPageCount() - 1}
                onClick={(event) => {
                  event.preventDefault();
                  table.setPageIndex(table.getPageCount() - 1);
                }}
                className={`px-4 py-2 rounded-md ${
                  table.getPageCount() - 1 === table.getState().pagination.pageIndex
                    ? "border-[#9B2626]"
                    : "border-none"
                }`}
              >
                {table.getPageCount()}
              </PaginationLink>
            </PaginationItem>

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
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
