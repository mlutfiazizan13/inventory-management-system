import { StockItem } from '@/types';
import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { useAppStore } from './useAppStore';
import toast from 'react-hot-toast';

interface StockItemState {
    name: string,
    // UI state
    isCreating: boolean;
    isEditing: boolean;
    editingItem: StockItem | null;
    isDeleting: boolean;
    deletingItem: StockItem | null;

    // UI actions
    startCreating: () => void;
    stopCreating: () => void;
    startEditing: (item: StockItem) => void;
    stopEditing: () => void;
    startDeleting: (item: StockItem) => void;
    stopDeleting: () => void;

    // Server actions (using Inertia)
    fetchItems: (params?: Record<string, any>) => void;
    createItem: (data: Omit<StockItem, 'id' | 'created_at' | 'updated_at' | 'product'>) => Promise<void>;
    updateItem: (id: number, data: Partial<Omit<StockItem, 'product'>>) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    // bulkDelete: (ids: number[]) => Promise<void>;
}

export const useStockItemStore = create<StockItemState>((set, get) => ({
    name: "Stock Item",
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
            router.put(route('stock-items.update', id), data, {
                preserveScroll: true,
                onSuccess: () => {
                    get().stopEditing();
                    toast.success(`${get().name} updated successfully!`);
                    resolve();
                },
                onError: (errors) => {
                    toast.error(`Failed to update ${get().name}`);
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
                    toast.success(`${get().name} deleted successfully!`);
                    resolve();
                },
                onError: (errors) => {
                    toast.error(`Failed to delete ${get().name}`);
                    reject(errors);
                },
            });
        });
    },
}));
