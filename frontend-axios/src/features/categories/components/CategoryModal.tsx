import { type FormEvent, useState } from "react";
import type { Category, CategoryCreatePayload, CategoryUpdatePayload } from "@/features/categories/types/category.types";
import { INPUT_MT_CLASS } from "@/shared/ui/fieldClasses";

interface Props {
  category: Category | null;
  saving: boolean;
  onCreate: (body: CategoryCreatePayload) => void;
  onUpdate: (id: number, body: CategoryUpdatePayload) => void;
  onClose: () => void;
}

export function CategoryModal({ category, saving, onCreate, onUpdate, onClose }: Props) {
  const [nombre, setNombre] = useState(category?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(category?.descripcion ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = { nombre: nombre.trim(), descripcion: descripcion.trim() };

    if (!category) {
      onCreate(body);
      return;
    }

    const changes: CategoryUpdatePayload = {};
    if (body.nombre !== category.nombre) changes.nombre = body.nombre;
    if (body.descripcion !== (category.descripcion ?? "")) changes.descripcion = body.descripcion;
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }
    onUpdate(category.id, changes);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="category-modal-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {category ? "Editar categoría" : "Nueva categoría"}
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nombre
            <input className={INPUT_MT_CLASS} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Descripción
            <textarea className={INPUT_MT_CLASS} rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}