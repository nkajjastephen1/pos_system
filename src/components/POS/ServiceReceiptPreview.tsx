import React from 'react';
import { ServiceTransaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Printer, CheckCircle } from 'lucide-react';
import { Dialog } from '../ui/Dialog';

interface ServiceReceiptPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ServiceTransaction | null;
}

export function ServiceReceiptPreview({
  isOpen,
  onClose,
  transaction
}: ServiceReceiptPreviewProps) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Payment Successful
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Service transaction completed
        </p>
      </div>

      <div id="receipt" className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6 text-sm font-mono">
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg uppercase">Nexus Store</h3>
          <p className="text-xs text-slate-500">
            123 Commerce St, Business City
          </p>
          <p className="text-xs text-slate-500">Tel: (555) 123-4567</p>
        </div>

        <div className="border-b border-dashed border-slate-300 my-3"></div>

        <div className="flex justify-between mb-1">
          <span>Date:</span>
          <span>{formatDate(transaction.date)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Type:</span>
          <span>SERVICE</span>
        </div>
        <div className="flex justify-between mb-3">
          <span>Trans ID:</span>
          <span>{transaction.id}</span>
        </div>

        <div className="border-b border-dashed border-slate-300 my-3"></div>

        <div className="space-y-2 mb-3">
          {transaction.items.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span clamp-text>
                {item.service.name}
              </span>
              <span>{formatCurrency(item.amountCharged)}</span>
            </div>
          ))}
        </div>

        <div className="border-b border-dashed border-slate-300 my-3"></div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(transaction.subtotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-2">
            <span>TOTAL</span>
            <span>{formatCurrency(transaction.total)}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-slate-300 my-3"></div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="capitalize">
              {transaction.paymentMethod.replace('_', ' ')}
            </span>
            <span>{formatCurrency(transaction.amountPaid)}</span>
          </div>
          <div className="flex justify-between">
            <span>Change</span>
            <span>{formatCurrency(transaction.change)}</span>
          </div>
        </div>

        <div className="text-center mt-6 text-xs">
          <p>Thank you for your business!</p>
          <p>Please come again.</p>
        </div>
      </div>

      <div className="flex gap-3 print:hidden">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Close
        </Button>
        <Button className="flex-1" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </Dialog>
  );
}
