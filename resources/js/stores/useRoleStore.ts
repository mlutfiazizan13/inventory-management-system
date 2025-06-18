import { CreateRole, Role } from '@/types';
import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { useAppStore } from './useAppStore';

interface RoleState<T, C> {
    items: T[];

    setItems: (items: T[]) => void;
    // UI state
    isCreating: boolean;
    isEditing: boolean;
    editingItem: T | null;
    isDeleting: boolean;
    deletingItem: T | null;

    // UI actions
    startCreating: () => void;
    stopCreating: () => void;
    startEditing: (item: T) => void;
    stopEditing: () => void;
    startDeleting: (item: T) => void;
    stopDeleting: () => void;

    // Server actions (using Inertia)
    fetchItems: (params?: Record<string, any>) => void;
    reloadItems: (params?: Record<string, any>) => void;
    createItem: (data: Omit<C, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateItem: (id: number, data: Partial<T>) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    // bulkDelete: (ids: number[]) => Promise<void>;
}

export const useRoleStore = create<RoleState<Role, CreateRole>>((set, get) => ({
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

    startDeleting: (item: Role) =>
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
            route('roles.index'),
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
        router.reload({ only: ['roles'] });
    },

    createItem: async (data) => {
        return new Promise((resolve, reject) => {
            router.post(route('roles.store'), data as any, {
                preserveState: false,
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
            router.put(route('roles.update', id), data as any, {
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
        await router.delete(route('roles.delete', id), {
            preserveState: false, // force reload fresh data
            preserveScroll: false,
            onSuccess: () => {
                useAppStore.getState().addNotification('Item deleted successfully!', 'success');
            },
            onError: (errors) => {
                useAppStore.getState().addNotification('Failed to delete item', 'error');
                throw errors;
            },
        });
    }
}));
