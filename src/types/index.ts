export type PaymentMethod = 'cash' | 'mobile_money' | 'card';
export type Category = 'electronics' | 'clothing' | 'food' | 'home' | 'other';

export interface Product {
  id: string;
  name: string;
  sku: string;
  cost: number;
  price: number;
  stock: number;
  category: Category;
  image_url?: string;  // Changed from 'image' to 'image_url' to match DB
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  date: string;
}

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  totalProducts: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
}