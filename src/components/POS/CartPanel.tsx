import React, { Component } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem as CartItemComponent } from './CartItem';
import { Button } from '../ui/Button';
import { usePOS } from '../../context/POSContext';
import { calculateSubtotal, calculateTax, calculateTotal } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
interface CartPanelProps {
  onCheckout: () => void;
}
export function CartPanel({
  onCheckout
}: CartPanelProps) {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart
  } = usePOS();
  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);
  if (cart.length === 0) {
    return <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-8 text-center border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
          Cart is empty
        </h3>
        <p className="text-sm">
          Select products from the grid to add them to the cart.
        </p>
      </div>;
  }
  return <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Current Order
        </h2>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {cart.map(item => <CartItemComponent key={item.product.id} item={item} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} />)}
      </div>

      {/* Totals Section */}
      <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Tax (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Button className="w-full h-12 text-lg" onClick={onCheckout}>
          Charge {formatCurrency(total)}
        </Button>
      </div>
    </div>;
}