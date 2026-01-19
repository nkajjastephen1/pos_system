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
  image?: string;
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
  date: string; // ISO string for easier serialization
}
export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  totalProducts: number;
}