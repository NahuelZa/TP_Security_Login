import { type FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FIELD_CLASS, INPUT_MT_CLASS } from "@/shared/ui/fieldClasses";

export function LoginPage() {
  const { user, isLoading, error, login, setError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Si ya hay sesión, no tiene sentido ver el login.
  if (user) return <Navigate to="/categories" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
    } catch {
      /* el mensaje queda en el store */
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
      <h1 className="text-center text-xl font-semibold text-zinc-900 dark:text-zinc-100">Iniciar sesión</h1>
      <p className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">API local · sesión en cookie httpOnly</p>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-4 space-y-3 text-left">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-300">
          Usuario
          <input className={INPUT_MT_CLASS} value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
        </label>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Contraseña
          <div className="relative mt-1">
            <input
              className={`${FIELD_CLASS} pr-24`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10"
              aria-pressed={showPassword}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white shadow hover:bg-violet-700 disabled:opacity-60"
        >
          {isLoading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿No tenés cuenta?{" "}
        <Link to="/register" onClick={() => setError(null)} className="font-medium text-violet-700 hover:underline dark:text-violet-300">
          Registrate
        </Link>
      </p>
    </div>
  );
}