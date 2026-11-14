import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

export function Toast() {
  const message = useNotificationStore((s) => s.message);
  const type = useNotificationStore((s) => s.type);
  const show = useNotificationStore((s) => s.show);
  const id = useNotificationStore((s) => s.id);
  const hideNotification = useNotificationStore((s) => s.hideNotification);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(hideNotification, 3000); // se oculta a los 3 s
    return () => clearTimeout(timer);
  }, [show, id, hideNotification]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg ${
        type === "error" ? "bg-red-600" : "bg-zinc-800 dark:bg-zinc-700"
      }`}
    >
      {message}
    </div>
  );
}