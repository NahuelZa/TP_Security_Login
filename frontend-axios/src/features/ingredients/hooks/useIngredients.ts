import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ingredientService from "@/features/ingredients/services/ingredient.service";
import type {
  Ingredient,
  IngredientCreatePayload,
  IngredientUpdatePayload,
} from "@/features/ingredients/types/ingredient.types";
import { notifyApiError } from "@/shared/utils/notify-api-error";
import { useNotificationStore } from "@/store/notificationStore";

export const INGREDIENTS_QUERY_KEY = ["ingredients"] as const;
const NO_INGREDIENTS: Ingredient[] = [];

export function useIngredients() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);

  const query = useQuery({
    queryKey: INGREDIENTS_QUERY_KEY,
    queryFn: ingredientService.listIngredients,
  });

  const afterChange = (message: string) => {
    showNotification(message);
    return queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });
  };

  const create = useMutation({
    mutationFn: (body: IngredientCreatePayload) => ingredientService.createIngredient(body),
    onSuccess: () => afterChange("Ingrediente creado"),
    onError: (e) => notifyApiError(e, "No se pudo crear el ingrediente"),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: IngredientUpdatePayload }) =>
      ingredientService.updateIngredient(id, body),
    onSuccess: () => afterChange("Ingrediente actualizado"),
    onError: (e) => notifyApiError(e, "No se pudo actualizar el ingrediente"),
  });

  const remove = useMutation({
    mutationFn: (id: number) => ingredientService.deleteIngredient(id),
    onSuccess: () => afterChange("Ingrediente eliminado"),
    onError: (e) => notifyApiError(e, "No se pudo eliminar el ingrediente"),
  });

  return {
    ingredients: query.data ?? NO_INGREDIENTS,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    createIngredient: create.mutate,
    updateIngredient: update.mutate,
    deleteIngredient: remove.mutate,
    isSaving: create.isPending || update.isPending,
  };
}