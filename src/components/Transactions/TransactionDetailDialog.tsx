import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
interface TransactionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}
export function TransactionDetailDialog({
  isOpen,
  onClose,
  transaction
}: TransactionDetailDialogProps) {
  if (!transaction) return null;
  return <Dialog isOpen={isOpen} onClose={onClose} title={`Transaction ${transaction.id}`} maxWidth="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Date</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {formatDate(transaction.date)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Payment Method</p>
            <Badge variant="secondary" className="capitalize mt-1">
              {transaction.paymentMethod.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="border rounded-lg border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transaction.items.map((item, idx) => <tr key={idx}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {item.product.name}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">
                    {formatCurrency(item.product.price)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(item.product.price * item.quantity)}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end space-y-2 text-sm">
          <div className="flex justify-between w-48 text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span>{formatCurrency(transaction.subtotal)}</span>
          </div>
          <div className="flex justify-between w-48 text-slate-500 dark:text-slate-400">
            <span>Tax (10%)</span>
            <span>{formatCurrency(transaction.tax)}</span>
          </div>
          <div className="flex justify-between w-48 text-lg font-bold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Total</span>
            <span>{formatCurrency(transaction.total)}</span>
          </div>
          <div className="flex justify-between w-48 text-slate-500 dark:text-slate-400 pt-2">
            <span>Paid</span>
            <span>{formatCurrency(transaction.amountPaid)}</span>
          </div>
          {transaction.change > 0 && <div className="flex justify-between w-48 text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Change</span>
              <span>{formatCurrency(transaction.change)}</span>
            </div>}
        </div>
      </div>
    </Dialog>;
}