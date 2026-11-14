import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/features/categories/types/category.types";
import { DataTable } from "@/shared/components/DataTable";
import { actionsColumn } from "@/shared/ui/actionsColumn";

interface Props {
  categories: Category[];
  isAdmin: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const colWidth = {
  id: "w-[8%]",
  nombre: "w-[25%]",
  descripcion: "w-[52%] break-words [overflow-wrap:anywhere]",
  acciones: "w-[15%]",
};

export function CategoriesTable({ categories, isAdmin, onEdit, onDelete }: Props) {
  const columns: ColumnDef<Category>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
    ...(isAdmin ? [actionsColumn<Category>(onEdit, onDelete)] : []),
  ];

  return <DataTable data={categories} columns={columns} colWidth={colWidth} />;
}