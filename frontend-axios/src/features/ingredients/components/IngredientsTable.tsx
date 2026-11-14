import type { ColumnDef } from "@tanstack/react-table";
import type { Ingredient } from "@/features/ingredients/types/ingredient.types";
import { DataTable } from "@/shared/components/DataTable";
import { actionsColumn } from "@/shared/ui/actionsColumn";

interface Props {
  ingredients: Ingredient[];
  isAdmin: boolean;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: number) => void;
}

const colWidth = {
  id: "w-[8%]",
  nombre: "w-[25%]",
  descripcion: "w-[52%] break-words [overflow-wrap:anywhere]",
  acciones: "w-[15%]",
};

export function IngredientsTable({ ingredients, isAdmin, onEdit, onDelete }: Props) {
  const columns: ColumnDef<Ingredient>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
    ...(isAdmin ? [actionsColumn<Ingredient>(onEdit, onDelete)] : []),
  ];

  return <DataTable data={ingredients} columns={columns} colWidth={colWidth} />;
}