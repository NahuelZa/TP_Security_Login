import { type FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { INPUT_MT_CLASS } from "@/shared/ui/fieldClasses";

export function RegisterPage() {
  const { user, isLoading, error, register, setError } = useAuth();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/categories" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ username, full_name: fullName, email, password });
    } catch {
      /* el mensaje queda en el store */
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
      <h1 className="text-center text-xl font-semibold text-zinc-900 dark:text-zinc-100">Crear cuenta</h1>

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
          Nombre completo
          <input className={INPUT_MT_CLASS} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
          <input className={INPUT_MT_CLASS} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Contraseña (mín. 8)
          <input className={INPUT_MT_CLASS} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white shadow hover:bg-violet-700 disabled:opacity-60"
        >
          {isLoading ? "Registrando…" : "Crear cuenta e iniciar sesión"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" onClick={() => setError(null)} className="font-medium text-violet-700 hover:underline dark:text-violet-300">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}