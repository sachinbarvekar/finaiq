
import React from 'react';
import { MOCK_DOCUMENTS } from '../constants';
import { Document as DocType, DocumentProcessingStatus, PaymentStatus } from '../types';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

const DocumentTable: React.FC<{ documents: DocType[] }> = ({ documents }) => {
    
    const getProcessingStatusColor = (status: DocumentProcessingStatus): 'green' | 'red' | 'yellow' => {
        switch(status) {
            case DocumentProcessingStatus.Ready: return 'green';
            case DocumentProcessingStatus.ExportError: return 'red';
            case DocumentProcessingStatus.ReviewRequired: return 'yellow';
            default: return 'yellow';
        }
    }

    const getPaymentStatusColor = (status: PaymentStatus): 'green' | 'red' | 'yellow' => {
        switch(status) {
            case PaymentStatus.Paid: return 'green';
            case PaymentStatus.Overdue: return 'red';
            case PaymentStatus.Pending: return 'yellow';
            default: return 'yellow';
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 text-sm font-semibold text-slate-600">Supplier</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Invoice #</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Processing Status</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Payment Status</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
                </thead>
                <tbody>
                {documents.map((doc, index) => (
                    <tr key={doc.id} className={`border-b border-slate-200 ${index === documents.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="p-4 text-sm text-slate-800 font-medium">{doc.supplier}</td>
                    <td className="p-4 text-sm text-slate-600">{doc.invoiceNumber}</td>
                    <td className="p-4 text-sm text-slate-600">{formatDate(doc.date)}</td>
                    <td className="p-4 text-sm text-slate-600">{doc.currency} {doc.amount.toFixed(2)}</td>
                    <td className="p-4"><Badge color={getProcessingStatusColor(doc.status)}>{doc.status}</Badge></td>
                    <td className="p-4"><Badge color={getPaymentStatusColor(doc.payment)}>{doc.payment}</Badge></td>
                    <td className="p-4">
                        <button className="p-2 text-slate-500 hover:text-primary rounded-full hover:bg-slate-100 transition-colors">
                            <Icon name="more" className="w-5 h-5" />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const Documents: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Folder: Innovate Inc.</h1>
        <Button leftIcon={<Icon name="upload" className="w-5 h-5"/>}>
          Upload Document
        </Button>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer mb-6">
        <Icon name="upload" className="w-12 h-12 mx-auto text-slate-400 mb-2"/>
        <p className="text-slate-600 font-semibold">Drag & drop files here</p>
        <p className="text-sm text-slate-500">or click to browse</p>
      </div>
      
      <DocumentTable documents={MOCK_DOCUMENTS} />
    </div>
  );
};

export default Documents;
