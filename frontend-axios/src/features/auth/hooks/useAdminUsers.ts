import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as usersService from "@/features/auth/services/users.service";
import type { UserPublic } from "@/features/auth/types/auth.types";
import { notifyApiError } from "@/shared/utils/notify-api-error";
import { useNotificationStore } from "@/store/notificationStore";

export const ADMIN_USERS_QUERY_KEY = ["admin-users"] as const;
const NO_USERS: UserPublic[] = [];

export type UserStatusAction = "activate" | "deactivate";

export function useAdminUsers() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);

  const query = useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: usersService.listUsers,
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, action }: { id: number; action: UserStatusAction }) =>
      action === "deactivate"
        ? usersService.deactivateUser(id)
        : usersService.activateUser(id),
    onSuccess: (_user, { action }) => {
      showNotification(action === "deactivate" ? "Usuario desactivado" : "Usuario activado");
      return queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
    onError: (e) => notifyApiError(e, "No se pudo actualizar el usuario"),
  });

  return {
    users: query.data ?? NO_USERS,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    changeUserStatus: changeStatus.mutate,
    pendingUserId: changeStatus.isPending ? (changeStatus.variables?.id ?? null) : null,
  };
}