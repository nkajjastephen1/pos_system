import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Product, Category } from '../../types';
interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
  product?: Product;
}
const CATEGORIES: {
  value: Category;
  label: string;
}[] = [{
  value: 'electronics',
  label: 'Electronics'
}, {
  value: 'clothing',
  label: 'Clothing'
}, {
  value: 'food',
  label: 'Food'
}, {
  value: 'home',
  label: 'Home'
}, {
  value: 'other',
  label: 'Other'
}];
export function ProductDialog({
  isOpen,
  onClose,
  onSave,
  product
}: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    category: 'other'
  });
  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        sku: '',
        price: 0,
        stock: 0,
        category: 'other'
      });
    }
  }, [product, isOpen]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Product);
    onClose();
  };
  return <Dialog isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Product Name" value={formData.name} onChange={e => setFormData({
        ...formData,
        name: e.target.value
      })} required placeholder="e.g. Wireless Mouse" />

        <div className="grid grid-cols-2 gap-4">
          <Input label="SKU" value={formData.sku} onChange={e => setFormData({
          ...formData,
          sku: e.target.value
        })} required placeholder="e.g. ELEC-001" />
          <Select label="Category" options={CATEGORIES} value={formData.category} onChange={e => setFormData({
          ...formData,
          category: e.target.value as Category
        })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Price ($)" type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({
          ...formData,
          price: parseFloat(e.target.value)
        })} required />
          <Input label="Stock" type="number" min="0" value={formData.stock} onChange={e => setFormData({
          ...formData,
          stock: parseInt(e.target.value)
        })} required />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Dialog>;
}