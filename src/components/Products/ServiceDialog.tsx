import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Service } from '../../types';

interface ServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id'> | Service) => Promise<void>;
  service?: Service;
}

export function ServiceDialog({
  isOpen,
  onClose,
  onSave,
  service
}: ServiceDialogProps) {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: ''
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: ''
      });
    }
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name) {
        alert('Please fill in all required fields');
        return;
      }

      console.log('Submitting service:', formData);
      await onSave(formData as Service);
      onClose();
    } catch (error: any) {
      console.error('Error saving service:', error);
      alert(`Failed to save service: ${error.message}`);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={service ? 'Edit Service' : 'Add New Service'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Service Name"
          value={formData.name}
          onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })}
          required
          placeholder="e.g. Haircut, Consultation"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Service
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
