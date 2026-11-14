import { UserRow } from "@/features/auth/components/UserRow";
import { useAdminUsers } from "@/features/auth/hooks/useAdminUsers";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const {
    users, isLoading, isFetching, error, refetch, changeUserStatus, pendingUserId,
  } = useAdminUsers();

  return (
    <section className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-amber-200/90 bg-amber-50/40 p-6 text-left shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Administración · Usuarios</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Activar o desactivar cuentas (solo rol admin).</p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {isFetching ? "Actualizando…" : "Actualizar"}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">Cargando usuarios…</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-700">
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isSelf={u.id === currentUser?.id}
              pending={pendingUserId === u.id}
              onActivate={() => changeUserStatus({ id: u.id, action: "activate" })}
              onDeactivate={(id) => changeUserStatus({ id, action: "deactivate" })}
            />
          ))}
        </ul>
      )}
    </section>
  );
}