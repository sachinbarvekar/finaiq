import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../../types';

type DocumentFormData = Partial<Omit<Document, 'id' | 'folderId' | 'currency'>>;

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentFormData) => void;
  documentToEdit: Document;
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ isOpen, onClose, onSubmit, documentToEdit }) => {
  const [formData, setFormData] = useState<DocumentFormData>({});
  
  useEffect(() => {
    if (documentToEdit) {
        setFormData({
            supplier: documentToEdit.supplier,
            invoiceNumber: documentToEdit.invoiceNumber,
            date: documentToEdit.date,
            amount: documentToEdit.amount,
            status: documentToEdit.status,
            payment: documentToEdit.payment,
            dueDate: documentToEdit.dueDate,
        });
    }
  }, [documentToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Invoice #${documentToEdit.invoiceNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                <input type="text" name="supplier" id="supplier" value={formData.supplier || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-slate-700 mb-1">Invoice #</label>
                <input type="text" name="invoiceNumber" id="invoiceNumber" value={formData.invoiceNumber || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount (USD)</label>
                <input type="number" name="amount" id="amount" value={formData.amount || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
             <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Invoice Date</label>
                <input type="date" name="date" id="date" value={formData.date || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" name="dueDate" id="dueDate" value={formData.dueDate || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Processing Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    {Object.values(DocumentProcessingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="payment" className="block text-sm font-medium text-slate-700 mb-1">Payment Status</label>
                <select name="payment" id="payment" value={formData.payment} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDocumentModal;
