import { api } from "@/shared/api/api";
import type {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
} from "@/features/categories/types/category.types";

const BASE = "/api/v1/categorias";

export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>(`${BASE}/`);
  return data;
}

export async function createCategory(body: CategoryCreatePayload): Promise<Category> {
  const { data } = await api.post<Category>(`${BASE}/`, body);
  return data;
}

export async function updateCategory(id: number, body: CategoryUpdatePayload): Promise<Category> {
  const { data } = await api.patch<Category>(`${BASE}/${id}`, body);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}