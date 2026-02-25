import React, { useEffect, useState, createContext, useContext } from 'react';
import { Product, CartItem, Transaction, PaymentMethod } from '../types';
import * as database from '../services/database';
import { useAuth } from './AuthContext';
import { calculateSubtotal, calculateTotal, calculateChange } from '../utils/calculations';

interface POSContextType {
  products: Product[];
  cart: CartItem[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCustomPrice: (productId: string, customPrice: number | undefined) => void;
  clearCart: () => void;
  processSale: (paymentMethod: PaymentMethod, amountPaid: number) => Promise<Transaction>;
  searchProducts: (query: string) => Product[];
  filterProductsByCategory: (category: string) => Product[];
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on mount and when online
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch from Supabase
        if (navigator.onLine && user) {
          const productsData = await database.fetchProducts(user.id);
          setProducts(productsData);
          localStorage.setItem('pos_products', JSON.stringify(productsData));
        } else if (!user) {
          setProducts([]);
        } else {
          // Use cached data if offline
          const cached = localStorage.getItem('pos_products');
          setProducts(cached ? JSON.parse(cached) : []);
        }

        // Fetch transactions only if user is logged in
        if (user && navigator.onLine) {
          const transactionsData = await database.fetchTransactions(user.id);
          setTransactions(transactionsData);
          localStorage.setItem('pos_transactions', JSON.stringify(transactionsData));
        } else if (user) {
          const cached = localStorage.getItem('pos_transactions');
          setTransactions(cached ? JSON.parse(cached) : []);
        }
      } catch (err: any) {
        setError(err.message);
        // Fall back to localStorage
        if (user) {
          const cached = localStorage.getItem('pos_products');
          setProducts(cached ? JSON.parse(cached) : []);
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

  // Product Actions
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      setError(null);
      const newProduct = await database.addProduct(productData, user.id);
      setProducts(prev => [...prev, newProduct]);
      localStorage.setItem('pos_products', JSON.stringify([...products, newProduct]));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      setError(null);
      await database.updateProduct(updatedProduct.id, updatedProduct);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      localStorage.setItem('pos_products', JSON.stringify(updated));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await database.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      const updated = products.filter(p => p.id !== id);
      localStorage.setItem('pos_products', JSON.stringify(updated));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Cart Actions (Local only until sale)
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {
          ...item,
          quantity: item.quantity + 1
        } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? {
      ...item,
      quantity
    } : item));
  };

  const updateCustomPrice = (productId: string, customPrice: number | undefined) => {
    setCart(prev => prev.map(item => item.product.id === productId ? {
      ...item,
      customPrice: customPrice && customPrice > 0 ? customPrice : undefined
    } : item));
  };

  const clearCart = () => setCart([]);

  // Transaction Actions - SYNCED TO SUPABASE
  const processSale = async (paymentMethod: PaymentMethod, amountPaid: number): Promise<Transaction> => {
    try {
      if (!user) throw new Error('User not authenticated');

      setError(null);
      const subtotal = calculateSubtotal(cart);
      const total = calculateTotal(subtotal);
      const change = calculateChange(amountPaid, total);

      const newTransaction: Transaction = {
        id: `TRX-${Date.now().toString().slice(-6)}`,
        items: [...cart],
        subtotal,
        tax: 0,
        total,
        paymentMethod,
        amountPaid,
        change,
        date: new Date().toISOString()
      };

      console.log('processSale - Creating transaction:', newTransaction);

      // Save to Supabase
      if (navigator.onLine) {
        console.log('processSale - Online, saving to Supabase...');
        try {
          await database.addTransaction(newTransaction, user.id);
          console.log('processSale - Transaction saved to Supabase');
        } catch (dbError: any) {
          console.error('processSale - Failed to save to Supabase:', dbError);
          // Continue anyway - we'll still save locally
        }
      }

      // Update local transactions
      setTransactions(prev => [newTransaction, ...prev]);

      // Save to localStorage for sync later (offline queue)
      const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
      syncQueue.push({ type: 'transaction', data: newTransaction, userId: user.id });
      localStorage.setItem('sync_queue', JSON.stringify(syncQueue));

      // Update stock locally
      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartItem.quantity)
          };
        }
        return p;
      }));

      clearCart();
      console.log('processSale - Transaction completed successfully');
      return newTransaction;
    } catch (err: any) {
      console.error('processSale - Error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Helpers
  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.sku.toLowerCase().includes(lowerQuery));
  };

  const filterProductsByCategory = (category: string) => {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
  };

  return (
    <POSContext.Provider
      value={{
        products,
        cart,
        transactions,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCustomPrice,
        clearCart,
        processSale,
        searchProducts,
        filterProductsByCategory
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}