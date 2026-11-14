import type { ColumnDef } from "@tanstack/react-table";

export function actionsColumn<T extends { id: number }>(
  onEdit: (item: T) => void,
  onDelete: (id: number) => void,
): ColumnDef<T> {
  return {
    id: "acciones",
    header: "Acciones",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="cursor-pointer rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(row.original.id)}
          className="cursor-pointer rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    ),
  };
}