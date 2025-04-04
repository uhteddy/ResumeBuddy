import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

function createToastStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    return {
        subscribe,
        add: (message: string, type: ToastType = 'info', duration: number = 3000) => {
            const id = Math.random().toString(36).substring(2, 9);
            update((toasts) => [...toasts, { id, message, type, duration }]);
            return id;
        },
        remove: (id: string) => {
            update((toasts) => toasts.filter((t) => t.id !== id));
        },
        success: (message: string, duration?: number) => {
            return toast.add(message, 'success', duration);
        },
        error: (message: string, duration?: number) => {
            return toast.add(message, 'error', duration);
        },
        warning: (message: string, duration?: number) => {
            return toast.add(message, 'warning', duration);
        },
        info: (message: string, duration?: number) => {
            return toast.add(message, 'info', duration);
        }
    };
}

export const toast = createToastStore(); 