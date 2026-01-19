import React, { useEffect, useState, createContext, useContext } from 'react';
import { Product, CartItem, Transaction, PaymentMethod } from '../types';
import { MOCK_PRODUCTS, MOCK_TRANSACTIONS } from '../utils/mockData';
import { calculateSubtotal, calculateTax, calculateTotal, calculateChange } from '../utils/calculations';
interface POSContextType {
  products: Product[];
  cart: CartItem[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartItemPrice: (productId: string, price: number) => void;
  clearCart: () => void;
  processSale: (paymentMethod: PaymentMethod, amountPaid: number) => Transaction;
  searchProducts: (query: string) => Product[];
  filterProductsByCategory: (category: string) => Product[];
}
const POSContext = createContext<POSContextType | undefined>(undefined);
export function POSProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // Initialize state from localStorage or mock data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pos_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pos_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('pos_transactions', JSON.stringify(transactions));
  }, [transactions]);
  // Product Actions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProducts(prev => [...prev, newProduct]);
  };
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };
  // Cart Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {
          ...item,
          quantity: item.quantity + 1
        } : item);
      }
      return [...prev, {
        product,
        quantity: 1
      }];
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
  const updateCartItemPrice = (productId: string, price: number) => {
    setCart(prev => prev.map(item => item.product.id === productId ? {
      ...item,
      customPrice: price
    } : item));
  };
  const clearCart = () => setCart([]);
  // Transaction Actions
  const processSale = (paymentMethod: PaymentMethod, amountPaid: number): Transaction => {
    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);
    const change = calculateChange(amountPaid, total);
    const newTransaction: Transaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      amountPaid,
      change,
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    // Update stock
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
    return newTransaction;
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
  return <POSContext.Provider value={{
    products,
    cart,
    transactions,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    processSale,
    searchProducts,
    filterProductsByCategory
  }}>
      {children}
    </POSContext.Provider>;
}
export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}