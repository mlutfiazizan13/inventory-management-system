import { EditPurchaseOrder, PurchaseOrder } from '@/types';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { useAppStore } from './useAppStore';

interface PurchaseOrderState<T, C, E> {
    name: string;
    items: T[];

    setItems: (items: T[]) => void;
    // UI state
    isCreating: boolean;
    isEditing: boolean;
    editingItem: E | null;
    isDeleting: boolean;
    deletingItem: T | null;
    isUpdateStatus: boolean;
    updateStatusItem: T | null;

    // UI actions
    startCreating: () => void;
    stopCreating: () => void;
    startEditing: (item: E) => void;
    stopEditing: () => void;
    startDeleting: (item: T) => void;
    stopDeleting: () => void;

    startUpdateStatus: (item: T) => void;
    stopUpdateStatus: () => void;

    // Server actions (using Inertia)
    fetchItems: (params?: Record<string, any>) => void;
    reloadItems: (params?: Record<string, any>) => void;
    createItem: (data: C) => Promise<void>;
    updateItem: (id: number | string, data: Partial<T>) => Promise<void>;
    deleteItem: (id: number | string) => Promise<void>;
    updateStatus: (id: number | string) => Promise<void>;
    // bulkDelete: (ids: number[]) => Promise<void>;
}

export const usePurchaseOrderStore = create<PurchaseOrderState<PurchaseOrder, PurchaseOrder, EditPurchaseOrder>>((set, get) => ({
    name: 'Purchase Order',
    items: [],
    setItems: (items) => set({ items: items }),

    isCreating: false,
    isEditing: false,
    editingItem: null,
    isDeleting: false,
    deletingItem: null,

    isUpdateStatus: false,
    updateStatusItem: null,

    // UI state management
    startCreating: () => set({ isCreating: true }),
    stopCreating: () => set({ isCreating: false }),

    startEditing: (item) =>
        set({
            isEditing: true,
            editingItem: item,
        }),

    stopEditing: () =>
        set({
            isEditing: false,
            editingItem: null,
        }),

    startDeleting: (item: PurchaseOrder) =>
        set({
            isDeleting: true,
            deletingItem: item,
        }),
    stopDeleting: () =>
        set({
            isDeleting: false,
            deletingItem: null,
        }),

    startUpdateStatus: (item: PurchaseOrder) =>
        set({
            isUpdateStatus: true,
            updateStatusItem: item,
        }),
    stopUpdateStatus: () =>
        set({
            isUpdateStatus: false,
            updateStatusItem: null,
        }),

    // Server operations using Inertia
    fetchItems: (params = {}) => {
        router.get(
            route('purchase_orders.index'),
            {
                ...params,
            },
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    },

    reloadItems: (params = {}) => {
        router.reload({ only: ['purchase_orders'] });
    },

    createItem: async (data) => {
        return new Promise((resolve, reject) => {
            router.post(route('purchase_orders.store'), data, {
                preserveScroll: true,
                onSuccess: (page) => {
                    get().stopCreating();
                    toast.success(`${get().name} created successfully!`);
                    resolve();
                },
                onError: (errors) => {
                    toast.error(`Failed to create ${get().name}`);
                    reject(errors);
                },
            });
        });
    },

    updateItem: async (id, data) => {
        return new Promise((resolve, reject) => {
            router.put(route('purchase_orders.update', id), data, {
                preserveScroll: true,
                onSuccess: () => {
                    get().stopEditing();
                    toast.success(`${get().name} updated successfully!`);
                },
                onError: (errors) => {
                    toast.error(`Failed to update ${get().name}`);
                    reject(errors);
                },
            });
        });
    },

    deleteItem: async (id) => {
        router.delete(route('purchase_orders.delete', id), {
            preserveScroll: false,
            onSuccess: () => {
                toast.success(`${get().name} deleted successfully!`);
            },
            onError: (errors) => {
                toast.error(`Failed to delete ${get().name}`);
                throw errors;
            },
        });
    },

    updateStatus: async (id) => {
        return new Promise((resolve, reject) => {
            router.put(
                route('purchase_orders.update_status', id),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        get().stopUpdateStatus();
                        toast.success(`${get().name} status updated successfully!`);
                    },
                    onError: (errors) => {
                        toast.error(`Failed to update status ${get().name}`);
                        reject(errors);
                    },
                },
            );
        });
    },

    // bulkDelete: async (ids) => {
    //     return new Promise((resolve, reject) => {
    //         router.delete(route('purchase_orders.bulk-destroy'), {
    //             data: { ids },
    //             preserveScroll: true,
    //             onSuccess: () => {
    //                 ids.forEach((id) => get().removeItem(id));
    //                 get().clearSelection();
    //                 useAppStore.getState().addNotification(`${ids.length} items deleted successfully!`, 'success');
    //                 resolve();
    //             },
    //             onError: (errors) => {
    //                 useAppStore.getState().addNotification('Failed to delete items', 'error');
    //                 reject(errors);
    //             },
    //         });
    //     });
    // },
}));
