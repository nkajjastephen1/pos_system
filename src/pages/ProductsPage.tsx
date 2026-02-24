import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { ProductsTable } from '../components/Products/ProductsTable';
import { ProductDialog } from '../components/Products/ProductDialog';
import { Button } from '../components/ui/Button';
import { Product } from '../types';
import { Dialog } from '../components/ui/Dialog';
export function ProductsPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  } = usePOS();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleSave = async (productData: Product | Omit<Product, 'id'>) => {
    try {
      console.log('handleSave called with:', productData);
      if ('id' in productData) {
        console.log('Updating product:', productData.id);
        await updateProduct(productData);
      } else {
        console.log('Adding new product');
        await addProduct(productData);
      }
      console.log('Product saved successfully');
    } catch (error: any) {
      console.error('Failed to save product:', error);
      throw error;
    }
  };
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(undefined);
  };
  const confirmDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      setDeleteId(null);
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Products
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your product inventory.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductsTable products={products} onEdit={handleEdit} onDelete={setDeleteId} />

      <ProductDialog isOpen={isDialogOpen} onClose={handleCloseDialog} onSave={handleSave} product={editingProduct} />

      <Dialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>;
}