export interface Ingredient {
  id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IngredientCreatePayload {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IngredientUpdatePayload {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}