import { useAuthStore } from "@/features/auth/store/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const checking = useAuthStore((s) => s.checking);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const setError = useAuthStore((s) => s.setError);

  return {
    user,
    isAuthenticated: user !== null,
    isAdmin: user?.role === "admin",
    checking,
    isLoading,
    error,
    login,
    register,
    logout,
    setError,
  };
}