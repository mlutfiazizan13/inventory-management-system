import { StockItem } from '@/types';
import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { useAppStore } from './useAppStore';

interface StockItemState {
    // Local state management
    items: StockItem[];

    // UI state
    isCreating: boolean;
    isEditing: boolean;
    editingItem: StockItem | null;
    isDeleting: boolean;
    deletingItem: StockItem | null;

    // Basic CRUD operations
    setItems: (items: StockItem[]) => void;

    // UI actions
    startCreating: () => void;
    stopCreating: () => void;
    startEditing: (item: StockItem) => void;
    stopEditing: () => void;
    startDeleting: (item: StockItem) => void;
    stopDeleting: () => void;

    // Server actions (using Inertia)
    fetchItems: (params?: Record<string, any>) => void;
    createItem: (data: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateItem: (id: number, data: Partial<StockItem>) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    // bulkDelete: (ids: number[]) => Promise<void>;
}

export const useStockItemStore = create<StockItemState>((set, get) => ({
    // Initial state
    items: [],
    isCreating: false,
    isEditing: false,
    editingItem: null,
    isDeleting: false,
    deletingItem: null,
    

    // Basic CRUD operations
    setItems: (items: StockItem[]) => set({ items }),


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

    startDeleting: (item: StockItem) => 
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
            route('stock-items.index'),
            {
                ...params,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    },

    createItem: async (data) => {
        return new Promise((resolve, reject) => {
            router.post(route('stock-items.store'), data, {
                preserveScroll: true,
                onSuccess: (page) => {
                    get().stopCreating();
                    useAppStore.getState().addNotification('Item created successfully!', 'success');
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
            router.put(route('stock-items.update', id), data, {
                preserveScroll: true,
                onSuccess: () => {
                    get().stopEditing();
                    useAppStore.getState().addNotification('Item updated successfully!', 'success');
                    resolve();
                },
                onError: (errors) => {
                    useAppStore.getState().addNotification('Failed to update item', 'error');
                    reject(errors);
                },
            });
        });
    },

    deleteItem: async (id) => {
        return new Promise((resolve, reject) => {
            router.delete(route('stock-items.delete', id), {
                preserveScroll: true,
                onSuccess: () => {
                    useAppStore.getState().addNotification('Item deleted successfully!', 'success');
                    resolve();
                },
                onError: (errors) => {
                    useAppStore.getState().addNotification('Failed to delete item', 'error');
                    reject(errors);
                },
            });
        });
    },

    // bulkDelete: async (ids) => {
    //     return new Promise((resolve, reject) => {
    //         router.delete(route('products.bulk-destroy'), {
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
