import { NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useThemeStore } from "@/store/themeStore";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive
      ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
  }`;

const btnClass =
  "rounded-lg border border-zinc-300 px-3 py-1.5 font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-700";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  if (!user) return null;

  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-700 dark:bg-zinc-800">
      <nav className="flex flex-wrap gap-1">
        <NavLink to="/categories" className={linkClass}>Categorías</NavLink>
        <NavLink to="/products" className={linkClass}>Productos</NavLink>
        <NavLink to="/ingredients" className={linkClass}>Ingredientes</NavLink>
        {isAdmin ? (
          <NavLink to="/admin/users" className={linkClass}>Usuarios</NavLink>
        ) : null}
      </nav>
      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
        <span>
          {user.full_name} ·{" "}
          <span className="font-medium text-violet-600 dark:text-violet-300">{user.role}</span>
        </span>
        <button type="button" onClick={toggleTheme} aria-pressed={darkMode} className={btnClass}>
          {darkMode ? "Modo claro" : "Modo oscuro"}
        </button>
        <button type="button" onClick={() => void logout()} className={btnClass}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}