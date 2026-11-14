import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/features/products/types/product.types";
import { DataTable } from "@/shared/components/DataTable";
import { actionsColumn } from "@/shared/ui/actionsColumn";

interface Props {
  products: Product[];
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const colWidth = {
  id: "w-[5%]",
  nombre: "w-[15%]",
  descripcion: "w-[10%] break-words [overflow-wrap:anywhere]",
  precio_base: "w-[12%]",
  disponible: "w-[10%]",
  categorias: "w-[14%]",
  ingredientes: "w-[14%]",
  acciones: "w-[20%]",
};

export function ProductsTable({ products, isAdmin, onEdit, onDelete }: Props) {
  const columns: ColumnDef<Product>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
    {
      accessorKey: "precio_base",
      header: "Precio",
      cell: ({ row }) => `$${row.original.precio_base.toFixed(2)}`,
    },
    {
      accessorKey: "disponible",
      header: "Estado",
      cell: ({ row }) => {
        const disponible = row.original.disponible;
        return (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
              disponible
                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
            }`}
          >
            {disponible ? "Disponible" : "No disponible"}
          </span>
        );
      },
    },
    {
      accessorKey: "categorias",
      header: "Categorías",
      cell: ({ row }) => {
        const cats = row.original.categorias;
        return cats && cats.length > 0 ? (
          cats.map((c) => c.nombre).join(", ")
        ) : (
          <span className="italic text-zinc-400">Sin categoría</span>
        );
      },
    },
    {
      accessorKey: "ingredientes",
      header: "Ingredientes",
      cell: ({ row }) => {
        const ings = row.original.ingredientes;
        return ings && ings.length > 0 ? (
          ings.map((i) => i.nombre).join(", ")
        ) : (
          <span className="italic text-zinc-400">Sin ingredientes</span>
        );
      },
    },
    ...(isAdmin ? [actionsColumn<Product>(onEdit, onDelete)] : []),
  ];

  return <DataTable data={products} columns={columns} colWidth={colWidth} dense />;
}