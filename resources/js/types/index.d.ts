import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

interface PageProps<T = any> {
  users: T[];
  meta: {
    total?: number;
    filters?: {
      search?: string;
      sort?: string;
    };
  };
  [key: string]: any; 
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface Product {
  id: number;
  name: string;
  sku: string;
  unit: string;
  category_id: number;
  brand_id: number;
  currency: string; // 3-letter currency code, e.g., "IDR"
  price: number; // Decimal with 2 digits precision
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
