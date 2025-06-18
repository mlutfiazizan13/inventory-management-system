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
  icon?: string;
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

export interface CreateRole {
  name: string;
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


export interface StockItem {
  id: number;
  product_id: string;
  quantity: number;
  product: Product;
  status: string; // You could also use a union type if you know all possible statuses
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}


export interface EditStockItem {
  id: number;
  product_id: string;
  quantity: number;
  status: string; // You could also use a union type if you know all possible statuses
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}


export interface Supplier {
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


interface PurchaseOrder {
  id: string; // BIGINT
  supplier_id: number; // FOREIGN KEY to suppliers
  supplier?: Supplier
  order_date: string; // DATE (ISO string format, e.g. "2024-01-01")
  expected_date?: string; // DATE, optional
  purchase_order_status: 'draft' | 'ordered' | 'received' | string; 
  status: string;
  total_cost: number; // DECIMAL
  notes?: string; // TEXT, optional
  purchase_order_items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

export type EditPurchaseOrder = {
  id: string,
  supplier_id: number
  order_date: string
  expected_date: string
  total_cost: number
  notes: string
  purchase_order_items: EditPurchaseOrderItem[]
}

export type EditPurchaseOrderItem = {
  product_id: number | null;
  quantity: number;
  unit_price: number;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: number;
  quantity: number;
  unit_price: number; // represents DECIMAL(20,2)
  status: string; // could be more specific like: 'active' | 'cancelled' etc.
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface StockAdjustment {
  id: bigint;
  product_id: int;
  product: Product;
  adjustment_type: string;
  quantity: number;
  reason: string;
  adjusted_by: User;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface SalesOrder {
  id: string;
  customer_id: number;
  customer: Customer;
  order_date: string;
  sales_status: string;
  payment_status: string;
  total_amount: number;
  notes: string;
  created_by: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export type EditSalesOrder = {
  id: string,
  customer_id: number
  order_date: string
  total_amount: number
  notes: string
  sales_order_items: EditSalesOrderItem[]
}

export type EditSalesOrderItem = {
  product_id: number | null;
  quantity: number;
  price: number;
}

export interface SalesOrderItem {
  id: string;
  sales_order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | undefined;
  address: string | undefined;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SalesOrder {
  id: string;
  customer_id: number;
  customer: Customer;
  order_date: string;
  sales_status: string;
  payment_status: string;
  total_amount: number;
  notes: string;
  created_by: number;
  status: string;
  created_at: string;
  updated_at: string;
}


export type EditSalesOrder = {
  id: string,
  customer_id: number
  order_date: string
  total_amount: number
  notes: string
  sales_order_items: EditSalesOrderItem[]
}

export type EditSalesOrderItem = {
  product_id: number | null;
  quantity: number;
  price: number;
}

export interface SalesOrderItem {
  id: string;
  sales_order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | undefined;
  address: string | undefined;
  status: string;
  created_at: string;
  updated_at: string;
}