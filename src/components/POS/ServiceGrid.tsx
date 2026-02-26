import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Service } from '../../types';
import { ServiceCard } from './ServiceCard';
import { Input } from '../ui/Input';
import { useServiceSales } from '../../context/ServiceSalesContext';

interface ServiceGridProps {
  onAddToCart: (service: Service, amount: number) => void;
}

export function ServiceGrid({ onAddToCart }: ServiceGridProps) {
  const { services } = useServiceSales();
  const [search, setSearch] = useState('');

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="p-4 space-y-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <Input
          placeholder="Search services..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
        {filteredServices.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 mt-10">
            <p>No services found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
