import { type FormEvent, useState } from "react";
import type {
  Ingredient,
  IngredientCreatePayload,
  IngredientUpdatePayload,
} from "@/features/ingredients/types/ingredient.types";
import { INPUT_MT_CLASS } from "@/shared/ui/fieldClasses";

interface Props {
  /** null = alta; con valor = edición. */
  ingredient: Ingredient | null;
  saving: boolean;
  onCreate: (body: IngredientCreatePayload) => void;
  onUpdate: (id: number, body: IngredientUpdatePayload) => void;
  onClose: () => void;
}

export function IngredientModal({ ingredient, saving, onCreate, onUpdate, onClose }: Props) {
  const [nombre, setNombre] = useState(ingredient?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(ingredient?.descripcion ?? "");
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErr(null);

    const trimmedNombre = nombre.trim();
    const trimmedDesc = descripcion.trim();
    if (!trimmedNombre) {
      setErr("El nombre no puede estar vacío.");
      return;
    }

    if (!ingredient) {
      onCreate({ nombre: trimmedNombre, descripcion: trimmedDesc });
      return;
    }

    // Edición: solo se envía lo que cambió.
    const changes: IngredientUpdatePayload = {};
    if (trimmedNombre !== ingredient.nombre) changes.nombre = trimmedNombre;
    if (trimmedDesc !== (ingredient.descripcion ?? "")) changes.descripcion = trimmedDesc;
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }
    onUpdate(ingredient.id, changes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
      >
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {ingredient ? "Editar ingrediente" : "Nuevo ingrediente"}
        </h3>

        {err ? (
          <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {err}
          </p>
        ) : null}

        <label className="mt-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nombre
          <input className={INPUT_MT_CLASS} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>

        <label className="mt-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Descripción
          <input className={INPUT_MT_CLASS} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {saving ? "Guardando…" : ingredient ? "Guardar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}