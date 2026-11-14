import { api } from "@/shared/api/api";
import type { UserPublic } from "@/features/auth/types/auth.types";

const BASE = "/api/v1/auth/admin/usuarios";

export async function listUsers(): Promise<UserPublic[]> {
  const { data } = await api.get<UserPublic[]>(BASE);
  return data;
}

export async function deactivateUser(userId: number): Promise<UserPublic> {
  const { data } = await api.post<UserPublic>(`${BASE}/${userId}/desactivar`);
  return data;
}

export async function activateUser(userId: number): Promise<UserPublic> {
  const { data } = await api.post<UserPublic>(`${BASE}/${userId}/activar`);
  return data;
}
