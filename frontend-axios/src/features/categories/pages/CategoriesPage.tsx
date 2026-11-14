import { useState } from "react";
import { useAuth } from "@/features/auth";
import { CategoriesTable } from "@/features/categories/components/CategoriesTable";
import { CategoryModal } from "@/features/categories/components/CategoryModal";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { Category} from "@/features/categories/types/category.types";

const outlineBtn =
    "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700";

export function CategoriesPage() {
    const { isAdmin } = useAuth();
    const {
        categories, isLoading, isFetching, error, refetch,
        createCategory, updateCategory, deleteCategory, isSaving,
    } = useCategories();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const openNew = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (category: Category) => {
        setEditing(category);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
    };
   

    const handleDelete = (id: number) => {
        if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
        deleteCategory(id);
    };

    return (
        <section className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-[var(--text-h)]">Panel de Categorías</h2>
                <div className="flex gap-2">
                    <button type="button" onClick={() => void refetch()} disabled={isFetching} className={`${outlineBtn} disabled:opacity-60`}>
                        {isFetching ? "Actualizando…" : "Actualizar"}
                    </button>
                    {isAdmin ? (
                        <button type="button" onClick={openNew} className={outlineBtn}>
                            + Nueva categoría
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
            ) : categories.length === 0 && !error ? (
                <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">No hay categorías</p>
            ) : categories.length > 0 ? (
                <CategoriesTable categories={categories} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
            ) : null}

            {modalOpen ? (
                <CategoryModal
                    key={editing?.id ?? "new"}
                    category={editing}
                    saving={isSaving}
                    onCreate={(body) => createCategory(body, { onSuccess: closeModal })}
                    onUpdate={(id, body) => updateCategory({ id, body }, { onSuccess: closeModal })}
                    onClose={closeModal}
                />
            ) : null}
        </section>
    );
}