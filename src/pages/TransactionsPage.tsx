import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { TransactionsTable } from '../components/Transactions/TransactionsTable';
import { TransactionDetailDialog } from '../components/Transactions/TransactionDetailDialog';
import { Transaction } from '../types';
export function TransactionsPage() {
  const {
    transactions
  } = usePOS();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Transactions
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          View and manage past sales.
        </p>
      </div>

      <TransactionsTable transactions={transactions} onViewDetails={setSelectedTransaction} />

      <TransactionDetailDialog isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} transaction={selectedTransaction} />
    </div>;
}