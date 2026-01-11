import React from 'react';
export function Card({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 ${className}`} {...props}>
      {children}
    </div>;
}
export function CardHeader({
  children,
  className = ''
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>;
}
export function CardTitle({
  children,
  className = ''
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>;
}
export function CardContent({
  children,
  className = ''
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}