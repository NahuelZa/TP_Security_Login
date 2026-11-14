import { api } from "@/shared/api/api";
import type {
  Ingredient,
  IngredientCreatePayload,
  IngredientUpdatePayload,
} from "@/features/ingredients/types/ingredient.types";

const BASE = "/api/v1/ingredientes";

export async function listIngredients(): Promise<Ingredient[]> {
  const { data } = await api.get<Ingredient[]>(`${BASE}/`);
  return data;
}

export async function createIngredient(body: IngredientCreatePayload): Promise<Ingredient> {
  const { data } = await api.post<Ingredient>(`${BASE}/`, body);
  return data;
}

export async function updateIngredient(id: number, body: IngredientUpdatePayload): Promise<Ingredient> {
  const { data } = await api.patch<Ingredient>(`${BASE}/${id}`, body);
  return data;
}

export async function deleteIngredient(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}