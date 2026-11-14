import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-amber-200 bg-amber-50/60 p-6 text-center shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Acceso denegado</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        No tenés permisos para ver esta página.
      </p>
      <Link
        to="/categories"
        className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}