import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getApiBase } from "@/shared/lib/config";


/**
 * Instancia Axios centralizada.
 *
 * `withCredentials: true` es lo que hace que el navegador adjunte la cookie
 * httpOnly `access_token` en cada request cross-origin (Vite 5173 → API 8000).
 * El JWT nunca toca JavaScript, por eso no inyectamos `Authorization: Bearer`.
 */
export const api = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
  timeout: 15_000,
  headers: { Accept: "application/json" },
});



/** Request interceptor: lógica transversal previa al envío. */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set("Accept", "application/json");
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

