import { useMemo, useState } from "react";
import { useAuth } from "@/features/auth";
import { ProductModal } from "@/features/products/components/ProductModal";
import { ProductsTable } from "@/features/products/components/ProductsTable";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types/product.types";

const outlineBtn =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700";

export function ProductsPage() {
  const { isAdmin } = useAuth();
  const {
    products, isLoading, isFetching, error, refetch,
    createProduct, updateProduct, deleteProduct, isSaving,
  } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // Un usuario común solo ve los productos disponibles.
  const visibleProducts = useMemo(
    () => (isAdmin ? products : products.filter((p) => p.disponible)),
    [isAdmin, products],
  );

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    deleteProduct(id);
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-6xl rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-[var(--shadow)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[var(--text-h)]">Panel de Productos</h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => void refetch()} disabled={isFetching} className={`${outlineBtn} disabled:opacity-60`}>
            {isFetching ? "Actualizando…" : "Actualizar"}
          </button>
          {isAdmin ? (
            <button type="button" onClick={openNew} className={outlineBtn}>
              + Nuevo producto
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-6 text-center text-sm text-[var(--text)]">Cargando productos…</p>
      ) : visibleProducts.length > 0 ? (
        <ProductsTable products={visibleProducts} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
      ) : !error ? (
        <p className="mt-6 text-center text-sm text-[var(--text)]">No hay productos disponibles en este momento.</p>
      ) : null}

      {modalOpen ? (
        <ProductModal
          key={editing?.id ?? "new"}
          product={editing}
          saving={isSaving}
          onCreate={(body) => createProduct(body, { onSuccess: closeModal })}
          onUpdate={(id, body) => updateProduct({ id, body }, { onSuccess: closeModal })}
          onClose={closeModal}
        />
      ) : null}
    </section>
  );
}