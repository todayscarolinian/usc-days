"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
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
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
      []
    )
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters
        }
	});

	return (
		<div className="rounded-md border">
			<div className="p-6 bg-black flex gap-4 justify-between items-center">
				<h1 className="uppercase text-white text-3xl font-bold">
					Sports
				</h1>
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
									<TableHead
										key={header.id}
										className="p-4 md:p-6"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
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
									<TableCell
										key={cell.id}
										className="p-4 md:p-6"
									>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex flex-col gap-4 items-center justify-center p-4">
				<Pagination>
					<PaginationContent>
						{/* Previous button */}
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={() => {
									if (
										table.getState().pagination.pageIndex >
										0
									) {
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
						{Array.from({ length: table.getPageCount() }).map(
							(_, index) => (
								<PaginationItem key={index}>
									<PaginationLink
										isActive={
											index ===
											table.getState().pagination
												.pageIndex
										}
										onClick={() =>
											table.setPageIndex(index)
										}
										className={`px-4 py-2 rounded-md ${
											index ===
											table.getState().pagination
												.pageIndex
												? "border-[#9B2626]"
												: "border-none"
										}`}
									>
										{index + 1}
									</PaginationLink>
								</PaginationItem>
							)
						)}
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
