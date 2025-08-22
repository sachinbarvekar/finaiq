
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../../types';

type DocumentFormData = Omit<Document, 'id' | 'folderId'>;

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentFormData) => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [supplier, setSupplier] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier.trim() || !invoiceNumber.trim() || !amount) {
      setError(true);
      return;
    }
    // Create a full document object with default/random values for simplicity
    const newDocumentData: DocumentFormData = {
        supplier,
        invoiceNumber,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(amount),
        currency: 'USD',
        status: DocumentProcessingStatus.ReviewRequired,
        payment: PaymentStatus.Pending,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due in 30 days
    }
    onSubmit(newDocumentData);
    
    // Reset form
    setSupplier('');
    setInvoiceNumber('');
    setAmount('');
    setError(false);
    onClose();
  };
  
  const resetAndClose = () => {
    setSupplier('');
    setInvoiceNumber('');
    setAmount('');
    setError(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Add New Invoice">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-slate-700 mb-1">
            Supplier Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="e.g., Tech Solutions Ltd"
            className={`w-full px-3 py-2 bg-slate-50 rounded-lg border ${error && !supplier ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
        </div>
         <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-slate-700 mb-1">
            Invoice # <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="e.g., INV-2024-004"
            className={`w-full px-3 py-2 bg-slate-50 rounded-lg border ${error && !invoiceNumber ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
        </div>
         <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
            Amount (USD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 1500.00"
            className={`w-full px-3 py-2 bg-slate-50 rounded-lg border ${error && !amount ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit">Add Invoice</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDocumentModal;
