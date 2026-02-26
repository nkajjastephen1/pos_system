import React, { useEffect, useState, createContext, useContext } from 'react';
import { Service, ServiceCartItem, ServiceTransaction, PaymentMethod } from '../types';
import * as database from '../services/database';
import { useAuth } from './AuthContext';
import { calculateTotal, calculateChange } from '../utils/calculations';

interface ServiceSalesContextType {
  services: Service[];
  cart: ServiceCartItem[];
  transactions: ServiceTransaction[];
  isLoading: boolean;
  error: string | null;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addToCart: (service: Service, amountCharged: number) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartAmount: (serviceId: string, amountCharged: number) => void;
  clearCart: () => void;
  processSale: (paymentMethod: PaymentMethod, amountPaid: number) => Promise<ServiceTransaction>;
  searchServices: (query: string) => Service[];
}

const ServiceSalesContext = createContext<ServiceSalesContextType | undefined>(undefined);

export function ServiceSalesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [transactions, setTransactions] = useState<ServiceTransaction[]>([]);
  const [cart, setCart] = useState<ServiceCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services on mount and when online
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch from Supabase
        if (navigator.onLine && user) {
          const servicesData = await database.fetchServices(user.id);
          setServices(servicesData);
          localStorage.setItem('service_sales_services', JSON.stringify(servicesData));
        } else if (!user) {
          setServices([]);
        } else {
          // Use cached data if offline
          const cached = localStorage.getItem('service_sales_services');
          setServices(cached ? JSON.parse(cached) : []);
        }

        // Fetch service transactions only if user is logged in
        if (user && navigator.onLine) {
          const transactionsData = await database.fetchServiceTransactions(user.id);
          setTransactions(transactionsData);
          localStorage.setItem('service_sales_transactions', JSON.stringify(transactionsData));
        } else if (user) {
          const cached = localStorage.getItem('service_sales_transactions');
          setTransactions(cached ? JSON.parse(cached) : []);
        }
      } catch (err: any) {
        setError(err.message);
        // Fall back to localStorage
        if (user) {
          const cached = localStorage.getItem('service_sales_services');
          setServices(cached ? JSON.parse(cached) : []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Listen for online/offline changes
    window.addEventListener('online', loadData);
    window.addEventListener('offline', () => {});

    return () => {
      window.removeEventListener('online', loadData);
    };
  }, [user]);

  // Service Actions
  const addService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      setError(null);
      const newService = await database.addService(serviceData, user.id);
      setServices(prev => [...prev, newService]);
      localStorage.setItem('service_sales_services', JSON.stringify([...services, newService]));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateService = async (updatedService: Service) => {
    try {
      setError(null);
      await database.updateService(updatedService.id, updatedService);
      setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
      const updated = services.map(s => s.id === updatedService.id ? updatedService : s);
      localStorage.setItem('service_sales_services', JSON.stringify(updated));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      setError(null);
      await database.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      const updated = services.filter(s => s.id !== id);
      localStorage.setItem('service_sales_services', JSON.stringify(updated));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Cart Actions (Local only until sale)
  const addToCart = (service: Service, amountCharged: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        // If service already in cart, replace it (only 1 quantity per service)
        return prev.map(item => 
          item.service.id === service.id ? { service, amountCharged } : item
        );
      }
      return [...prev, { service, amountCharged }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(item => item.service.id !== serviceId));
  };

  const updateCartAmount = (serviceId: string, amountCharged: number) => {
    if (amountCharged <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.service.id === serviceId 
        ? { ...item, amountCharged }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  // Transaction Actions - SYNCED TO SUPABASE
  const processSale = async (paymentMethod: PaymentMethod, amountPaid: number): Promise<ServiceTransaction> => {
    try {
      if (!user) throw new Error('User not authenticated');

      setError(null);
      
      // Calculate subtotal from service items
      const subtotal = cart.reduce((sum, item) => sum + item.amountCharged, 0);
      const total = calculateTotal(subtotal);
      const change = calculateChange(amountPaid, total);

      const newTransaction: ServiceTransaction = {
        id: `SRV-${Date.now().toString().slice(-6)}`,
        items: [...cart],
        subtotal,
        tax: 0,
        total,
        paymentMethod,
        amountPaid,
        change,
        date: new Date().toISOString(),
        type: 'service'
      };

      console.log('processSale - Creating service transaction:', newTransaction);

      // Save to Supabase
      if (navigator.onLine) {
        console.log('processSale - Online, saving to Supabase...');
        try {
          await database.addServiceTransaction(newTransaction, user.id);
          console.log('processSale - Service transaction saved to Supabase');
        } catch (dbError: any) {
          console.error('processSale - Failed to save to Supabase:', dbError);
          // Continue anyway - we'll still save locally
        }
      }

      // Update local transactions
      setTransactions(prev => [newTransaction, ...prev]);

      // Save to localStorage for sync later (offline queue)
      const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
      syncQueue.push({ type: 'service_transaction', data: newTransaction, userId: user.id });
      localStorage.setItem('sync_queue', JSON.stringify(syncQueue));

      clearCart();
      console.log('processSale - Service transaction completed successfully');
      return newTransaction;
    } catch (err: any) {
      console.error('processSale - Error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Helpers
  const searchServices = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return services.filter(s => s.name.toLowerCase().includes(lowerQuery));
  };

  return (
    <ServiceSalesContext.Provider
      value={{
        services,
        cart,
        transactions,
        isLoading,
        error,
        addService,
        updateService,
        deleteService,
        addToCart,
        removeFromCart,
        updateCartAmount,
        clearCart,
        processSale,
        searchServices
      }}
    >
      {children}
    </ServiceSalesContext.Provider>
  );
}

export function useServiceSales() {
  const context = useContext(ServiceSalesContext);
  if (context === undefined) {
    throw new Error('useServiceSales must be used within a ServiceSalesProvider');
  }
  return context;
}
