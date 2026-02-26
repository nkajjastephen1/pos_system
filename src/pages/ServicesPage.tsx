import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useServiceSales } from '../context/ServiceSalesContext';
import { ServicesTable } from '../components/Products/ServicesTable';
import { ServiceDialog } from '../components/Products/ServiceDialog';
import { Button } from '../components/ui/Button';
import { Service } from '../types';
import { Dialog } from '../components/ui/Dialog';

export function ServicesPage() {
  const {
    services,
    addService,
    updateService,
    deleteService
  } = useServiceSales();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async (serviceData: Service | Omit<Service, 'id'>) => {
    try {
      console.log('handleSave called with:', serviceData);
      if ('id' in serviceData) {
        console.log('Updating service:', serviceData.id);
        await updateService(serviceData);
      } else {
        console.log('Adding new service');
        await addService(serviceData);
      }
      console.log('Service saved successfully');
    } catch (error: any) {
      console.error('Failed to save service:', error);
      throw error;
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(undefined);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteService(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Services
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your services.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <ServicesTable services={services} onEdit={handleEdit} onDelete={setDeleteId} />

      <ServiceDialog isOpen={isDialogOpen} onClose={handleCloseDialog} onSave={handleSave} service={editingService} />

      <Dialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Service" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this service? This action cannot be
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
    </div>
  );
}
