import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Service } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

import { Plus } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onAddToCart: (service: Service, amount: number) => void;
}

export function ServiceCard({ service, onAddToCart }: ServiceCardProps) {
  const [amount, setAmount] = useState(0);
  const [showInput, setShowInput] = useState(false);

  const handleAddToCart = () => {
    if (amount > 0) {
      onAddToCart(service, amount);
      setShowInput(false);
      setAmount(0);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full cursor-pointer transition-all hover:shadow-md flex flex-col overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-500/50">
        <div className="h-32 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 flex items-center justify-center">
          <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            {service.name.charAt(0)}
          </span>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-3">
            {service.name}
          </h3>

          {showInput ? (
            <div className="mt-auto space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                  placeholder="Enter amount"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setShowInput(false);
                    setAmount(0);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              Add to Cart
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
