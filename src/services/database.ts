import { supabase } from './supabaseClient';
import { Product, Transaction } from '../types';

// ===== PRODUCTS =====
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw error;
  return data || [];
}

export async function addProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ===== TRANSACTIONS =====
export async function fetchTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addTransaction(transaction: Transaction, userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      id: transaction.id,
      user_id: userId,
      items: transaction.items,
      subtotal: transaction.subtotal,
      tax: transaction.tax,
      total: transaction.total,
      payment_method: transaction.paymentMethod,
      amount_paid: transaction.amountPaid,
      change: transaction.change,
      date: transaction.date
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== AUTHENTICATION =====
export async function signUp(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      console.error('Auth signup error:', error);
      throw error;
    }

    // Try to insert user into users table
    if (data.user) {
      try {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email,
            full_name: fullName
          }])
          .select();

        if (insertError) {
          console.warn('Users table insert warning:', insertError);
          // Don't throw - user is still created in auth system
        }
      } catch (tableError) {
        console.warn('Users table operation failed (non-critical):', tableError);
        // Non-critical error, user auth succeeded
      }
    }

    return data;
  } catch (err) {
    console.error('Signup failed:', err);
    throw err;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// ===== IMAGE UPLOAD =====
export async function uploadProductImage(file: File, productId: string) {
  const fileName = `${productId}-${Date.now()}.${file.name.split('.').pop()}`;
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}