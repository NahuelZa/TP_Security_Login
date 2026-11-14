import { create } from "zustand";
import * as authService from "@/features/auth/services/auth.service";
import type { UserPublic, UserRegisterPayload } from "@/features/auth/types/auth.types";
import { queryClient } from "@/shared/api/queryClient";

interface AuthState {
  user: UserPublic | null;
  /** true mientras se verifica la sesión al iniciar (GET /auth/me). */
  checking: boolean;
  /** true mientras un login o registro está en curso. */
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (payload: UserRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearSession: () => void;
  setError: (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  checking: true,
  isLoading: false,
  error: null,

  setError: (msg) => set({ error: msg }),

  clearSession: () =>{
    set({ user: null, checking: false, isLoading: false, error: null }),
    queryClient.clear();
    },

  checkAuth: async () => {
    set({ checking: true });
    try {
      const user = await authService.requestMe();
      set({ user, checking: false });
    } catch {
      set({ user: null, checking: false });
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestLogin(username, password);
      const user = await authService.requestMe();
      set({ user, isLoading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error de inicio de sesión";
      set({ user: null, isLoading: false, error: msg });
      throw e;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestRegister(payload);
      set({ isLoading: false });
      await get().login(payload.username, payload.password);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al registrarse";
      set({ isLoading: false, error: msg });
      throw e;
    }
  },

  logout: async () => {
    try {
      await authService.requestLogout();
    } catch {
      // Aun si falla la red, limpiamos el estado local.
    }
    set({ user: null, error: null, isLoading: false });
    queryClient.clear();
  },
}));