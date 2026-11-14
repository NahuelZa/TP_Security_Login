import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "@/features/categories/services/category.service";
import type {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
} from "@/features/categories/types/category.types";
import { notifyApiError } from "@/shared/utils/notify-api-error";
import { useNotificationStore } from "@/store/notificationStore";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;
const NO_CATEGORIES: Category[] = []; // referencia estable (ver abajo)

export function useCategories() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);

  const query = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoryService.listCategories,
  });

  // Avisa y refresca el listado. Al devolver la promesa, la mutación sigue
  // "pendiente" hasta que la lista nueva llegó.
  const afterChange = (message: string) => {
    showNotification(message);
    return queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
  };

  const create = useMutation({
    mutationFn: (body: CategoryCreatePayload) => categoryService.createCategory(body),
    onSuccess: () => afterChange("Categoría creada"),
    onError: (e) => notifyApiError(e, "No se pudo crear la categoría"),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: CategoryUpdatePayload }) =>
      categoryService.updateCategory(id, body),
    onSuccess: () => afterChange("Categoría actualizada"),
    onError: (e) => notifyApiError(e, "No se pudo actualizar la categoría"),
  });

  const remove = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => afterChange("Categoría eliminada"),
    onError: (e) => notifyApiError(e, "No se pudo eliminar la categoría"),
  });

  return {
    categories: query.data ?? NO_CATEGORIES,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    createCategory: create.mutate,
    updateCategory: update.mutate,
    deleteCategory: remove.mutate,
    isSaving: create.isPending || update.isPending,
  };
}