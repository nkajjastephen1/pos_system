import { supabase } from './supabaseClient';
import { Product, Transaction, Service, ServiceTransaction } from '../types';

// ===== PRODUCTS =====
export async function fetchProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function addProduct(product: Omit<Product, 'id'>, userId: string) {
  try {
    console.log('addProduct - Inserting:', product);
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to insert product: ${error.message}`);
    }
    console.log('Product inserted successfully:', data);
    return data;
  } catch (err: any) {
    console.error('addProduct error:', err);
    throw err;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  try {
    console.log('updateProduct - Updating:', id, updates);
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Failed to update product: ${error.message}`);
    }
    console.log('Product updated successfully:', data);
    return data;
  } catch (err: any) {
    console.error('updateProduct error:', err);
    throw err;
  }
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ===== TRANSACTIONS =====
export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addTransaction(transaction: Transaction, userId: string) {
  try {
    console.log('addTransaction - Inserting transaction:', { id: transaction.id, userId });
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

    if (error) {
      console.error('Supabase transaction insert error:', error);
      throw new Error(`Failed to save transaction: ${error.message}`);
    }
    console.log('Transaction saved successfully:', data);
    return data;
  } catch (err: any) {
    console.error('addTransaction error:', err);
    throw err;
  }
}

// ===== SERVICES =====
export async function fetchServices(userId: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function addService(service: Omit<Service, 'id'>, userId: string) {
  try {
    console.log('addService - Inserting:', service);
    const { data, error } = await supabase
      .from('services')
      .insert([{ ...service, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to insert service: ${error.message}`);
    }
    console.log('Service inserted successfully:', data);
    return data;
  } catch (err: any) {
    console.error('addService error:', err);
    throw err;
  }
}

export async function updateService(id: string, updates: Partial<Service>) {
  try {
    console.log('updateService - Updating:', id, updates);
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Failed to update service: ${error.message}`);
    }
    console.log('Service updated successfully:', data);
    return data;
  } catch (err: any) {
    console.error('updateService error:', err);
    throw err;
  }
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ===== SERVICE TRANSACTIONS =====
export async function fetchServiceTransactions(userId: string): Promise<ServiceTransaction[]> {
  const { data, error } = await supabase
    .from('service_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addServiceTransaction(transaction: ServiceTransaction, userId: string) {
  try {
    console.log('addServiceTransaction - Inserting transaction:', { id: transaction.id, userId });
    const { data, error } = await supabase
      .from('service_transactions')
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
        date: transaction.date,
        type: 'service'
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase service transaction insert error:', error);
      throw new Error(`Failed to save service transaction: ${error.message}`);
    }
    console.log('Service transaction saved successfully:', data);
    return data;
  } catch (err: any) {
    console.error('addServiceTransaction error:', err);
    throw err;
  }
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