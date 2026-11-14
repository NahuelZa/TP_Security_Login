import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import type { Role } from "@/features/auth";

interface ProtectedRouteProps {
  /** Si se omite, alcanza con tener sesión. */
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAuthStore((s) => s.user);
  const checking = useAuthStore((s) => s.checking);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Verificando sesión…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  //replace reemplaza la entrada del historial en vez de agregar otra. Sin esto, el botón “atrás” te devuelve a la ruta protegida, que te vuelve a redirigir, y quedás atrapado.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}