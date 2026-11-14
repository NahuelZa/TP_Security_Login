import type { AxiosError } from "axios";
import { useAuthStore } from "@/features/auth";
import { api } from "./api";
import {
  extractApiErrorMessage,
  handleApiError,
} from "@/shared/utils/handle-api-error";
import { useNotificationStore } from "@/store/notificationStore";

// En estos endpoints un 401 es parte del flujo normal, no una sesión vencida:
//  - /auth/token: credenciales incorrectas
//  - /auth/me: al iniciar, "todavía no hay sesión"
const AUTH_ENDPOINTS = ["/auth/token", "/auth/me"];

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    handleApiError(error);

    const url = error.config?.url ?? "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((p) => url.endsWith(p));

    if (error.response?.status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().clearSession();
    }
    if (error.response?.status === 403) {
  useNotificationStore
    .getState()
    .showNotification("Acceso denegado: no tenés permisos para esta acción", "error");
}

    const normalized = new Error(extractApiErrorMessage(error));
    normalized.cause = error;
    return Promise.reject(normalized);
  },
);