import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { ProductGrid } from '../components/POS/ProductGrid';
import { CartPanel } from '../components/POS/CartPanel';
import { CheckoutDialog } from '../components/POS/CheckoutDialog';
import { ReceiptPreview } from '../components/POS/ReceiptPreview';
import { calculateSubtotal, calculateTax, calculateTotal } from '../utils/calculations';
import { PaymentMethod, Transaction } from '../types';
export function POSPage() {
  const {
    addToCart,
    cart,
    processSale
  } = usePOS();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);
  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };
  const handleConfirmSale = async (method: PaymentMethod, amountPaid: number) => {
    try {
      const transaction = await processSale(method, amountPaid);
      setLastTransaction(transaction);
      setIsCheckoutOpen(false);
      setIsReceiptOpen(true);
    } catch (error: any) {
      console.error('Sale failed:', error);
      // Extract meaningful error message
      const errorMsg = error.message || 'Failed to process sale. Please try again.';
      alert(errorMsg);
    }
  };
  return <div className="flex h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8 overflow-hidden">
      {/* Left Side: Product Grid */}
      <div className="flex-1 min-w-0 border-r border-slate-200 dark:border-slate-800">
        <ProductGrid onAddToCart={addToCart} />
      </div>

      {/* Right Side: Cart Panel */}
      <div className="w-[400px] hidden lg:block bg-white dark:bg-slate-900 shadow-xl z-10">
        <CartPanel onCheckout={handleCheckout} />
      </div>

      {/* Mobile/Tablet Cart Drawer (could be implemented as a sheet/drawer, but for now we'll rely on responsive hiding) */}
      {/* For this implementation, on smaller screens, we might want a toggle or tab system, but the prompt asked for split layout on desktop */}

      <CheckoutDialog isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} total={total} onConfirm={handleConfirmSale} />

      <ReceiptPreview isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} transaction={lastTransaction} />
    </div>;
}