import { CartItem } from '../types';
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.customPrice ?? item.product.price) * item.quantity, 0);
};
export const calculateTotal = (subtotal: number): number => {
  return subtotal;
};
export const calculateChange = (amountPaid: number, total: number): number => {
  return Math.max(0, amountPaid - total);
};