import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productService from "@/features/products/services/product.service";
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
} from "@/features/products/types/product.types";
import { notifyApiError } from "@/shared/utils/notify-api-error";
import { useNotificationStore } from "@/store/notificationStore";

export const PRODUCTS_QUERY_KEY = ["products"] as const;
const NO_PRODUCTS: Product[] = [];

export function useProducts() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);

  const query = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productService.listProducts,
  });

  const afterChange = (message: string) => {
    showNotification(message);
    return queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
  };

  const create = useMutation({
    mutationFn: (body: ProductCreatePayload) => productService.createProduct(body),
    onSuccess: () => afterChange("Producto creado"),
    onError: (e) => notifyApiError(e, "No se pudo crear el producto"),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: ProductUpdatePayload }) =>
      productService.updateProduct(id, body),
    onSuccess: () => afterChange("Producto actualizado"),
    onError: (e) => notifyApiError(e, "No se pudo actualizar el producto"),
  });

  const remove = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => afterChange("Producto eliminado"),
    onError: (e) => notifyApiError(e, "No se pudo eliminar el producto"),
  });

  return {
    products: query.data ?? NO_PRODUCTS,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    createProduct: create.mutate,
    updateProduct: update.mutate,
    deleteProduct: remove.mutate,
    isSaving: create.isPending || update.isPending,
  };
}