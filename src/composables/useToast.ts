import { ref } from 'vue';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  timeoutId?: ReturnType<typeof setTimeout>;
}

const toasts = ref<ToastItem[]>([]);
let nextId = 0;

export function useToast() {
  const removeToast = (id: number) => {
    const toast = toasts.value.find((t) => t.id === id);
    if (toast?.timeoutId) {
      clearTimeout(toast.timeoutId);
    }
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const show = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    const id = nextId++;
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, duration);

    toasts.value.push({ id, message, type, timeoutId });
  };

  const clearAll = () => {
    toasts.value.forEach((t) => {
      if (t.timeoutId) {
        clearTimeout(t.timeoutId);
      }
    });
    toasts.value = [];
  };

  return { toasts, show, removeToast, clearAll };
}
