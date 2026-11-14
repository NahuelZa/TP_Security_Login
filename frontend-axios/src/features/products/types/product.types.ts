import type { Category } from "@/features/categories";
import type { Ingredient } from "@/features/ingredients";

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  disponible: boolean;
  categorias: Category[];
  ingredientes: Ingredient[];
}

export interface ProductCreatePayload {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  disponible?: boolean;
  categoria_ids?: number[];
  ingrediente_ids?: number[];
}

export interface ProductUpdatePayload {
  nombre?: string;
  descripcion?: string;
  precio_base?: number;
  disponible?: boolean;
  categoria_ids?: number[];
  ingrediente_ids?: number[];
}