import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminUsersPage, LoginPage, RegisterPage } from "@/features/auth";
import { Navbar } from "@/shared/components/Navbar";
import { UnauthorizedPage } from "@/shared/components/UnauthorizedPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { CategoriesPage } from "@/features/categories";
import { IngredientsPage } from "@/features/ingredients";
import { ProductsPage } from "@/features/products";


function PublicLayout() {
  return (
   <div className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-3xl text-center">
        <Outlet />
      </div>
    </div>
  );
}

function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-3xl text-center">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas: no pasan por ProtectedRoute */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>

        {/* Protegidas: cualquier usuario con sesión */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
          </Route>
        </Route>

        {/* Solo admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/categories" replace />} />
      </Routes>
    </BrowserRouter>
  );
}