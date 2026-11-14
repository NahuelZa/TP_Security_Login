import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  /** Clases de ancho por id de columna, ej. { id: "w-[8%]" }. */
  colWidth?: Record<string, string>;
  /** Letra más chica y scroll horizontal, para tablas anchas. */
  dense?: boolean;
  pageSize?: number;
}

const sortLabel: Record<string, string> = { asc: " ↑", desc: " ↓" };

const btnClass =
  "cursor-pointer rounded-md border border-[var(--border)] bg-[var(--social-bg)] px-4 py-2 text-[15px] text-[var(--text-h)] transition-[box-shadow,border-color] hover:border-[var(--accent-border)] hover:shadow-[var(--shadow)] disabled:cursor-not-allowed disabled:opacity-45";

const cellBase = "border-b border-[var(--border)] px-4 py-3 text-left align-top";

export function DataTable<T>({
  data,
  columns,
  colWidth = {},
  dense = false,
  pageSize = 5,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div
      className={`mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)] ${
        dense ? "overflow-x-auto" : "overflow-hidden"
      }`}
    >
      <table className={`w-full table-fixed border-collapse ${dense ? "text-[14px]" : "text-[15px]"}`}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`bg-[var(--code-bg)] font-semibold text-[var(--text-h)] ${cellBase} ${colWidth[header.column.id] ?? ""}`}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className="inline-flex w-full cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-left font-inherit text-inherit disabled:cursor-default"
                      onClick={header.column.getToggleSortingHandler()}
                      disabled={!header.column.getCanSort()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted()
                        ? sortLabel[header.column.getIsSorted() as string]
                        : null}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-[var(--social-bg)] last:[&>td]:border-b-0">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={`${cellBase} ${colWidth[cell.column.id] ?? ""}`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <nav
        className="flex items-center justify-center gap-4 border-t border-[var(--border)] bg-[var(--code-bg)] px-4 py-4"
        aria-label="Paginación"
      >
        <button type="button" className={btnClass} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </button>
        <span className="min-w-[140px] text-center text-sm text-[var(--text)]">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
        </span>
        <button type="button" className={btnClass} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </button>
      </nav>
    </div>
  );
}