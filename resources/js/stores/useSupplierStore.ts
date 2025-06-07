import { Supplier } from '@/types';
import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { useAppStore } from './useAppStore';

interface SupplierState {
    items: Supplier[];

    setItems: (items: Supplier[]) => void;
    // UI state
    isCreating: boolean;
    isEditing: boolean;
    editingItem: Supplier | null;
    isDeleting: boolean;
    deletingItem: Supplier | null;

    // UI actions
    startCreating: () => void;
    stopCreating: () => void;
    startEditing: (item: Supplier) => void;
    stopEditing: () => void;
    startDeleting: (item: Supplier) => void;
    stopDeleting: () => void;

    // Server actions (using Inertia)
    fetchItems: (params?: Record<string, any>) => void;
    reloadItems: (params?: Record<string, any>) => void;
    createItem: (data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateItem: (id: number, data: Partial<Supplier>) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    // bulkDelete: (ids: number[]) => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
    items: [],
    setItems: (items) => set({ items: items }),

    isCreating: false,
    isEditing: false,
    editingItem: null,
    isDeleting: false,
    deletingItem: null,

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

    startDeleting: (item: Supplier) =>
        set({
            isDeleting: true,
            deletingItem: item,
        }),
    stopDeleting: () =>
        set({
            isDeleting: false,
            deletingItem: null,
        }),

    // Server operations using Inertia
    fetchItems: (params = {}) => {
        router.get(
            route('suppliers.index'),
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
        router.reload({ only: ['suppliers'] });
    },

    createItem: async (data) => {
        console.log("create");
        
        return new Promise((resolve, reject) => {
            router.post(route('suppliers.store'), data, {
                preserveScroll: true,
                onSuccess: (page) => {
                    get().stopCreating();
                    useAppStore.getState().addNotification('Item created successfully!', 'success');
                    get().reloadItems();
                    resolve();
                },
                onError: (errors) => {
                    useAppStore.getState().addNotification('Failed to create item', 'error');
                    reject(errors);
                },
            });
        });
    },

    updateItem: async (id, data) => {
        return new Promise((resolve, reject) => {
            router.put(route('suppliers.update', id), data, {
                preserveScroll: true,
                onSuccess: () => {
                    get().stopEditing();
                    useAppStore.getState().addNotification('Item updated successfully!', 'success');
                    get().reloadItems();
                },
                onError: (errors) => {
                    useAppStore.getState().addNotification('Failed to update item', 'error');
                    reject(errors);
                },
            });
        });
    },

    deleteItem: async (id) => {
        await router.delete(route('suppliers.delete', id), {
            preserveScroll: false,
            onSuccess: () => {
                useAppStore.getState().addNotification('Item deleted successfully!', 'success');
            },
            onError: (errors) => {
                useAppStore.getState().addNotification('Failed to delete item', 'error');
                throw errors;
            },
        });
    },

    // bulkDelete: async (ids) => {
    //     return new Promise((resolve, reject) => {
    //         router.delete(route('suppliers.bulk-destroy'), {
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
