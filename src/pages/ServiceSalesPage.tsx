import React, { useState } from 'react';
import { useServiceSales } from '../context/ServiceSalesContext';
import { ServiceGrid } from '../components/POS/ServiceGrid';
import { ServiceCartPanel } from '../components/POS/ServiceCartPanel';
import { ServiceCheckoutDialog } from '../components/POS/ServiceCheckoutDialog';
import { ServiceReceiptPreview } from '../components/POS/ServiceReceiptPreview';
import { calculateTotal } from '../utils/calculations';
import { PaymentMethod, ServiceTransaction } from '../types';

export function ServiceSalesPage() {
  const { addToCart, cart, processSale } = useServiceSales();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<ServiceTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.amountCharged, 0);
  const total = calculateTotal(subtotal);

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
      const errorMsg = error.message || 'Failed to process sale. Please try again.';
      alert(errorMsg);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8 overflow-hidden">
      {/* Left Side: Service Grid */}
      <div className="flex-1 min-w-0 border-r border-slate-200 dark:border-slate-800">
        <ServiceGrid onAddToCart={addToCart} />
      </div>

      {/* Right Side: Cart Panel */}
      <div className="w-[400px] hidden lg:block bg-white dark:bg-slate-900 shadow-xl z-10">
        <ServiceCartPanel onCheckout={handleCheckout} />
      </div>

      <ServiceCheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
        onConfirm={handleConfirmSale}
      />

      <ServiceReceiptPreview
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={lastTransaction}
      />
    </div>
  );
}
