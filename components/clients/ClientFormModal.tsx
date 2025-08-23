
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Client } from '../../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: Omit<Client, 'id' | 'status' | 'accountCreated' | 'lastActivity' | 'monthlyGrowth' | 'folderId' | 'integration' | 'approvedDocs' | 'pendingDocs' | 'rejectedDocs' | 'adminId'>) => void;
  clientToEdit: Client | null;
}

const initialFormData = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
};

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSubmit, clientToEdit }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    companyName: false,
    contactName: false,
    email: false,
  });
  
  const isEditMode = clientToEdit !== null;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        companyName: clientToEdit.companyName,
        contactName: clientToEdit.contactName,
        email: clientToEdit.email,
        phone: clientToEdit.phone,
        address: clientToEdit.address || '',
        notes: clientToEdit.notes || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({ companyName: false, contactName: false, email: false });
  }, [clientToEdit, isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
        setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
        companyName: !formData.companyName,
        contactName: !formData.contactName,
        email: !formData.email,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
        return;
    }

    onSubmit(formData);
  };
  
  const InputField: React.FC<{label:string, name:string, value:string, onChange: any, required?: boolean, error?: boolean, placeholder?: string, type?:string}> = ({label, name, value, onChange, required, error, placeholder, type="text"}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 bg-slate-50 rounded-lg border ${error ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} />
     </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Client' : 'Add New Client'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required error={errors.companyName} placeholder="e.g. Innovate Inc."/>
            <InputField label="Contact Name" name="contactName" value={formData.contactName} onChange={handleChange} required error={errors.contactName} placeholder="e.g. John Doe"/>
            <InputField label="Email" name="email" value={formData.email} onChange={handleChange} required error={errors.email} placeholder="e.g. contact@innovate.com" type="email"/>
            <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 123-456-7890"/>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} maxLength={500} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEditMode ? 'Save Changes' : 'Save Client'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormModal;
