import React, { useEffect, useState } from 'react';
import { DollarSign, CreditCard, Smartphone } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/formatters';
interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (method: PaymentMethod, amountPaid: number) => void;
}
export function CheckoutDialog({
  isOpen,
  onClose,
  total,
  onConfirm
}: CheckoutDialogProps) {
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState<string>('');
  useEffect(() => {
    if (isOpen) {
      setMethod('cash');
      setAmountPaid('');
    }
  }, [isOpen]);
  const change = method === 'cash' && amountPaid ? Math.max(0, parseFloat(amountPaid) - total) : 0;
  const isValid = method !== 'cash' || parseFloat(amountPaid) >= total;
  const handleConfirm = () => {
    if (isValid) {
      onConfirm(method, method === 'cash' ? parseFloat(amountPaid) : total);
    }
  };
  const quickAmounts = [total, Math.ceil(total / 5) * 5, Math.ceil(total / 10) * 10, Math.ceil(total / 20) * 20];
  const uniqueQuickAmounts = Array.from(new Set(quickAmounts)).filter(amount => amount >= total).slice(0, 4);
  return <Dialog isOpen={isOpen} onClose={onClose} title="Complete Payment" maxWidth="md">
      <div className="space-y-6">
        <div className="text-center py-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Amount Due
          </p>
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(total)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setMethod('cash')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === 'cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}>
            <DollarSign className="h-6 w-6 mb-2" />
            <span className="font-medium">Cash</span>
          </button>
          <button onClick={() => setMethod('card')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === 'card' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}>
            <CreditCard className="h-6 w-6 mb-2" />
            <span className="font-medium">Card</span>
          </button>
          <button onClick={() => setMethod('mobile_money')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === 'mobile_money' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}>
            <Smartphone className="h-6 w-6 mb-2" />
            <span className="font-medium">Mobile</span>
          </button>
        </div>

        {method === 'cash' && <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Amount Received
              </label>
              <Input type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} placeholder="0.00" className="text-lg" autoFocus />
            </div>

            <div className="flex gap-2 flex-wrap">
              {uniqueQuickAmounts.map(amount => <button key={amount} onClick={() => setAmountPaid(amount.toString())} className="px-4 py-2 text-sm font-medium bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg transition-colors">
                  {formatCurrency(amount)}
                </button>)}
            </div>

            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Change Due
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(change)}
              </span>
            </div>
          </div>}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid} className="w-full sm:w-auto">
            Confirm Payment
          </Button>
        </div>
      </div>
    </Dialog>;
}