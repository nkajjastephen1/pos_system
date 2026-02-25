import { useState } from 'react';
import { Minus, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onUpdatePrice?: (id: string, price: number | undefined) => void;
  onRemove: (id: string) => void;
}
export function CartItem({
  item,
  onUpdateQuantity,
  onUpdatePrice,
  onRemove
}: CartItemProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(String(item.customPrice ?? item.product.price));
  
  const displayPrice = item.customPrice ?? item.product.price;
  const lineTotal = displayPrice * item.quantity;
  
  const handlePriceSave = () => {
    const newPrice = parseFloat(priceInput);
    if (!isNaN(newPrice) && newPrice > 0 && onUpdatePrice) {
      onUpdatePrice(item.product.id, newPrice);
    }
    setIsEditingPrice(false);
  };

  return <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
          {item.product.name}
        </h4>
        {isEditingPrice ? (
          <div className="flex items-center gap-3 mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border-2 border-blue-400 w-full">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">Price:</div>
            <input
              type="number"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              step="0.01"
              min="0.01"
              className="flex-1 h-10 px-3 text-base font-semibold border-2 border-slate-300 rounded-md dark:bg-slate-800 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handlePriceSave}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
              title="Save price"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsEditingPrice(false)}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingPrice(true)}
            className="mt-2 p-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors flex items-center gap-2 group"
          >
            <Edit2 className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(displayPrice)}
              </p>
              {item.customPrice && (
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  ✓ Custom Price
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-700">
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors rounded-l-md" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-slate-100">
            {item.quantity}
          </span>
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors rounded-r-md disabled:opacity-50" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-[80px] text-right font-medium text-slate-900 dark:text-slate-100">
          {formatCurrency(lineTotal)}
        </div>

        <button onClick={() => onRemove(item.product.id)} className="text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>;
}