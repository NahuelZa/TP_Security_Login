import { create } from "zustand";

export type NotificationType = "success" | "error";

interface NotificationStore {
  message: string;
  type: NotificationType;
  show: boolean;
  /** Cambia en cada llamada: reinicia el temporizador aunque el texto se repita. */
  id: number;
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  message: "",
  type: "success",
  show: false,
  id: 0,
  showNotification: (message, type = "success") =>
    set((state) => ({ message, type, show: true, id: state.id + 1 })),
  hideNotification: () => set({ message: "", show: false }),
}));