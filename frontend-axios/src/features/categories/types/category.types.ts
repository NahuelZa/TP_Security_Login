export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CategoryCreatePayload {
  nombre: string;
  descripcion?: string;
}

export interface CategoryUpdatePayload {
  nombre?: string;
  descripcion?: string;
}