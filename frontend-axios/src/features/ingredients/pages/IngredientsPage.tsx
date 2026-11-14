import { useState } from "react";
import { useAuth } from "@/features/auth";
import { IngredientModal } from "@/features/ingredients/components/IngredientModal";
import { IngredientsTable } from "@/features/ingredients/components/IngredientsTable";
import { useIngredients } from "@/features/ingredients/hooks/useIngredients";
import type { Ingredient } from "@/features/ingredients/types/ingredient.types";

const outlineBtn =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700";

export function IngredientsPage() {
  const { isAdmin } = useAuth();
  const {
    ingredients, isLoading, isFetching, error, refetch,
    createIngredient, updateIngredient, deleteIngredient, isSaving,
  } = useIngredients();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este ingrediente?")) return;
    deleteIngredient(id);
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[var(--text-h)]">Panel de Ingredientes</h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => void refetch()} disabled={isFetching} className={`${outlineBtn} disabled:opacity-60`}>
            {isFetching ? "Actualizando…" : "Actualizar"}
          </button>
          {isAdmin ? (
            <button type="button" onClick={openNew} className={outlineBtn}>
              + Nuevo ingrediente
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
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">Cargando…</p>
      ) : ingredients.length > 0 ? (
        <IngredientsTable ingredients={ingredients} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
      ) : !error ? (
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">No hay ingredientes</p>
      ) : null}

      {modalOpen ? (
        <IngredientModal
          key={editing?.id ?? "new"}
          ingredient={editing}
          saving={isSaving}
          onCreate={(body) => createIngredient(body, { onSuccess: closeModal })}
          onUpdate={(id, body) => updateIngredient({ id, body }, { onSuccess: closeModal })}
          onClose={closeModal}
        />
      ) : null}
    </section>
  );
}