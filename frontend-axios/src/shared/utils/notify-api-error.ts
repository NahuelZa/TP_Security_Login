import axios from "axios";
import { useNotificationStore } from "@/store/notificationStore";

/** Muestra el error de una mutación como notificación roja. */
export function notifyApiError(error: unknown, fallback: string): void {
  // El interceptor guardó el AxiosError original en `cause`.
  const cause = error instanceof Error ? error.cause : undefined;
  const status = axios.isAxiosError(cause) ? cause.response?.status : undefined;

  // 401 y 403 ya los resuelve el interceptor (sesión limpiada / "acceso denegado").
  if (status === 401 || status === 403) return;

  const message = error instanceof Error && error.message ? error.message : fallback;
  useNotificationStore.getState().showNotification(message, "error");
}