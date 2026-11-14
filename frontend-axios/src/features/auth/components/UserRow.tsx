import type { UserPublic } from "@/features/auth/types/auth.types";

interface Props {
  user: UserPublic;
  isSelf: boolean;
  pending: boolean;
  onActivate: () => void;
  onDeactivate: (id: number) => void;
}

export function UserRow({ user, isSelf, pending, onActivate, onDeactivate }: Props) {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-zinc-900 dark:text-zinc-100">
          {user.full_name}{" "}
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">(@{user.username})</span>
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {user.email} · rol{" "}
          <span className="font-medium text-violet-600 dark:text-violet-300">{user.role}</span>
          {user.disabled ? (
            <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300">
              Inactivo
            </span>
          ) : (
            <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              Activo
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {user.disabled ? (
          <button
            type="button"
            disabled={pending}
            onClick={onActivate}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending ? "…" : "Activar"}
          </button>
        ) : (
          <button
            type="button"
            disabled={pending || isSelf}
            title={isSelf ? "No podés desactivar tu propia cuenta desde aquí" : undefined}
            onClick={() => onDeactivate(user.id)}
            className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-950/40"
          >
            {pending ? "…" : "Desactivar"}
          </button>
        )}
      </div>
    </li>
  );
}