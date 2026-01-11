import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
interface RecentTransactionsTableProps {
  transactions: Transaction[];
}
export function RecentTransactionsTable({
  transactions
}: RecentTransactionsTableProps) {
  return <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Transaction ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 rounded-r-lg">Payment</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(trx => <tr key={trx.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {trx.id}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {formatDate(trx.date)}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {trx.items.length} items
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(trx.total)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="capitalize">
                      {trx.paymentMethod.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>)}
              {transactions.length === 0 && <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No recent transactions found
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>;
}