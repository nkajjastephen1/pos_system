import { CartItem } from '../types';
export const TAX_RATE = 0.1;
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};
export const calculateTax = (subtotal: number): number => {
  return subtotal * TAX_RATE;
};
export const calculateTotal = (subtotal: number, tax: number): number => {
  return subtotal + tax;
};
export const calculateChange = (amountPaid: number, total: number): number => {
  return Math.max(0, amountPaid - total);
};