import { Product } from '@/types';
import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { useAppStore } from './useAppStore';
import toast from 'react-hot-toast';

interface ProductState {
    name: string,
    items: Product[];

    setItems: (items: Product[]) => void;
    // UI state
    isCreating: boolean;
    isEditing: boolean;
    editingItem: Product | null;
    isDeleting: boolean;
    deletingItem: Product | null;

    // UI actions
    startCreating: () => void;
    stopCreating: () => void;
    startEditing: (item: Product) => void;
    stopEditing: () => void;
    startDeleting: (item: Product) => void;
    stopDeleting: () => void;

    // Server actions (using Inertia)
    fetchItems: (params?: Record<string, any>) => void;
    reloadItems: (params?: Record<string, any>) => void;
    createItem: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateItem: (id: number, data: Partial<Product>) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    // bulkDelete: (ids: number[]) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
    name: "Product",
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

    startDeleting: (item: Product) =>
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
            route('products.index'),
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
        router.reload({ only: ['products'] });
    },

    createItem: async (data) => {
        return new Promise((resolve, reject) => {
            router.post(route('products.store'), data, {
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
            router.put(route('products.update', id), data, {
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
        router.delete(route('products.delete', id), {
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
}));
