import { useAppStore } from "@/stores/useAppStore";
import { PageProps, Product } from "@/types";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

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