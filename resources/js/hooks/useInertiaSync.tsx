import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useAppStore } from '@/stores/useAppStore';
import { PageProps, Product } from '@/types';
import { useProductStore } from '@/stores/useProductStore';

// Hook to sync Inertia page data with Zustand stores
export function useInertiaSync() {
  const page = usePage<PageProps>();
  const { setUser, addNotification } = useAppStore();
  
  // Sync auth user
  useEffect(() => {
    if (page.props.auth?.user) {
      setUser(page.props.auth.user);
    }
  }, [page.props.auth?.user, setUser]);
  
  // Handle flash messages
  useEffect(() => {
    if (page.props.flash?.message) {
      addNotification(page.props.flash.message, 'success');
    }
    if (page.props.flash?.error) {
      addNotification(page.props.flash.error, 'error');
    }
  }, [page.props.flash, addNotification]);
}

// Hook specifically for stock items pages
export function useProductInertiaSync() {
  const page = usePage<PageProps<Product>>();
  const { setItems } = useProductStore();
  
  useEffect(() => {
    if (page.props.products) {
      setItems(page.props.products);
    }
  }, [page.props.products, setItems]);
}
