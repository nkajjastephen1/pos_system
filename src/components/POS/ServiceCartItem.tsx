import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { ServiceCartItem as ServiceCartItemType } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ServiceCartItemProps {
  item: ServiceCartItemType;
  onUpdateAmount: (serviceId: string, amount: number) => void;
  onRemove: (serviceId: string) => void;
}

export function ServiceCartItem({
  item,
  onUpdateAmount,
  onRemove
}: ServiceCartItemProps) {
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [amountInput, setAmountInput] = useState(String(item.amountCharged));

  const handleAmountSave = () => {
    const newAmount = parseFloat(amountInput);
    if (!isNaN(newAmount) && newAmount > 0) {
      onUpdateAmount(item.service.id, newAmount);
    }
    setIsEditingAmount(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
          {item.service.name}
        </h4>
        {isEditingAmount ? (
          <div className="flex items-center gap-3 mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border-2 border-blue-400 w-full">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">
              Amount:
            </div>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              step="0.01"
              min="0.01"
              className="flex-1 h-10 px-3 text-base font-semibold border-2 border-slate-300 rounded-md dark:bg-slate-800 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleAmountSave}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
              title="Save amount"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsEditingAmount(false)}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingAmount(true)}
            className="mt-2 p-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors flex items-center gap-2 group"
          >
            <Edit2 className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(item.amountCharged)}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-[80px] text-right font-medium text-slate-900 dark:text-slate-100">
          {formatCurrency(item.amountCharged)}
        </div>

        <button
          onClick={() => onRemove(item.service.id)}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
