import { CreateUser, User } from '@/types';
import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { useAppStore } from './useAppStore';
import toast from 'react-hot-toast';

interface UserState {
    name: string,
    items: User[];

    setItems: (items: User[]) => void;
    // UI state
    isCreating: boolean;
    isEditing: boolean;
    editingItem: User | null;
    isDeleting: boolean;
    deletingItem: User | null;

    // UI actions
    startCreating: () => void;
    stopCreating: () => void;
    startEditing: (item: User) => void;
    stopEditing: () => void;
    startDeleting: (item: User) => void;
    stopDeleting: () => void;

    // Server actions (using Inertia)
    fetchItems: (params?: Record<string, any>) => void;
    reloadItems: (params?: Record<string, any>) => void;
    createItem: (data: Omit<CreateUser, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateItem: (id: number, data: Partial<User>) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    // bulkDelete: (ids: number[]) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    name: "User",
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

    startDeleting: (item: User) =>
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
            route('users.index'),
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
        router.reload({ only: ['Users'] });
    },

    createItem: async (data) => {
        return new Promise((resolve, reject) => {
            router.post(route('users.store'), data as any, {
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
            router.put(route('users.update', id), data as any, {
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
        router.delete(route('users.delete', id), {
            preserveState: false, // force reload fresh data
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

    // bulkDelete: async (ids) => {
    //     return new Promise((resolve, reject) => {
    //         router.delete(route('users.bulk-destroy'), {
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
