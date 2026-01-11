import React from 'react';
import { DollarSign, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { SalesCard } from '../components/Dashboard/SalesCard';
import { RecentTransactionsTable } from '../components/Dashboard/RecentTransactionsTable';
import { formatCurrency } from '../utils/formatters';
export function DashboardPage() {
  const {
    transactions,
    products
  } = usePOS();
  // Calculate metrics
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;
  const totalProducts = products.length;
  const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Overview of your store's performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SalesCard title="Total Sales" value={formatCurrency(totalSales)} icon={DollarSign} description="All time revenue" />
        <SalesCard title="Transactions" value={totalTransactions} icon={CreditCard} description="Total orders processed" />
        <SalesCard title="Products" value={totalProducts} icon={ShoppingBag} description="Items in inventory" />
        <SalesCard title="Avg. Order Value" value={formatCurrency(averageOrderValue)} icon={TrendingUp} description="Per transaction" />
      </div>

      <RecentTransactionsTable transactions={transactions} />
    </div>;
}