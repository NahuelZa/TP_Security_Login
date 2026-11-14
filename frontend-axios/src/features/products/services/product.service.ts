import { api } from "@/shared/api/api";
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
} from "@/features/products/types/product.types";

const BASE = "/api/v1/productos";

export async function listProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>(`${BASE}/`);
  return data;
}

export async function createProduct(body: ProductCreatePayload): Promise<Product> {
  const { data } = await api.post<Product>(`${BASE}/`, body);
  return data;
}

export async function updateProduct(id: number, body: ProductUpdatePayload): Promise<Product> {
  const { data } = await api.patch<Product>(`${BASE}/${id}`, body);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}