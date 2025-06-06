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
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    preserveState?: boolean;
    children?: NavItem[];
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
  auth: {
    user: User;
  };
  flash: {
    message?: string;
    error?: string;
  };
  [key: string]: any; 
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    roles?: Role[];
    created_at: string;
    updated_at: string;
    // [key: string]: unknown;
}


export interface CreateUser {
    name: string;
    email: string;
    role_id: number;
    password: string;
    password_confirmation: string;
}

export interface Role {
  id: number;
  name: string;
  status: string; // can restrict more tightly if needed
  created_at: string; // or Date, depending on your API or ORM
  updated_at: string;
}


// Product
export interface Product {
  id: number;
  name: string;
  sku: string;
  unit: string;
  category_id: string;
  brand_id: string;
  currency: string; // 3-letter currency code, e.g., "IDR"
  price: number; // Decimal with 2 digits precision
  status: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}


interface StockItem {
  id: number;
  product_id: string;
  quantity: number;
  product: Product;
  status: string; // You could also use a union type if you know all possible statuses
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}


interface EditStockItem {
  id: number;
  product_id: string;
  quantity: number;
  status: string; // You could also use a union type if you know all possible statuses
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}


interface Supplier {
  id: number;
  name: string;
  contact_name: string | undefined;
  email: string | undefined;
  phone: string;
  address: string | undefined;
  status: string;
  created_at: string;
  updated_at: string;
}
