import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { BoxIcon } from 'lucide-react';
interface SalesCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: string;
  trendUp?: boolean;
  description?: string;
}
export function SalesCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  description
}: SalesCardProps) {
  return <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {value}
          </h3>
          {(trend || description) && <p className="text-xs text-slate-500 dark:text-slate-400">
              {trend && <span className={trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                  {trend}
                </span>}
              {trend && description && ' '}
              {description}
            </p>}
        </div>
      </CardContent>
    </Card>;
}