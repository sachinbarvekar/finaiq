import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../../types';
import { Icon, IconName } from '../ui/Icon';

interface StatusPillProps {
    text: string;
    type: 'processing' | 'payment';
}

const StatusPill: React.FC<StatusPillProps> = ({ text, type }) => {
    const processingColors: Record<DocumentProcessingStatus, string> = {
        [DocumentProcessingStatus.Ready]: 'bg-green-100 text-green-700',
        [DocumentProcessingStatus.ExportError]: 'bg-red-100 text-red-700',
        [DocumentProcessingStatus.ReviewRequired]: 'bg-yellow-100 text-yellow-700',
    };

    const paymentColors: Record<PaymentStatus, string> = {
        [PaymentStatus.Paid]: 'bg-green-100 text-green-700',
        [PaymentStatus.Pending]: 'bg-yellow-100 text-yellow-700',
        [PaymentStatus.Overdue]: 'bg-red-100 text-red-700',
    };

    const colorClass = type === 'processing' ? processingColors[text as DocumentProcessingStatus] : paymentColors[text as PaymentStatus];

    return (
        <button className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold focus:outline-none ${colorClass}`}>
            {text}
            <Icon name="chevron-down" className="w-4 h-4 ml-1 opacity-60" />
        </button>
    );
};

const ActionMenuItem: React.FC<{ label: string; icon: IconName; onClick: () => void; className?: string }> = ({ label, icon, onClick, className = '' }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className={`flex items-center w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-100 rounded-md ${className}`}
    >
        <Icon name={icon} className="w-4 h-4 mr-2" />
        <span>{label}</span>
    </button>
);

const ActionMenu: React.FC<{ 
    doc: Document; 
    folderId: string;
    onDelete: (docId: string) => void; 
    onDownload: (docId: string) => void; 
    onReprocess: (docId: string) => void;
    onEdit: (docId: string) => void;
}> = ({ doc, folderId, onDelete, onDownload, onReprocess, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 text-slate-500 hover:text-primary rounded-full hover:bg-slate-100 transition-colors"
                aria-label={`Actions for ${doc.invoiceNumber}`}
            >
                <Icon name="more" className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <ActionMenuItem label="View Document" icon="view" onClick={() => handleAction(() => navigate(`/dashboard/folders/${folderId}/documents/${doc.id}`))} />
                        <ActionMenuItem label="Download Document" icon="download" onClick={() => handleAction(() => onDownload(doc.id))} />
                        <ActionMenuItem label="Reprocess Invoice" icon="reprocess" onClick={() => handleAction(() => onReprocess(doc.id))} />
                        <ActionMenuItem label="Edit Details" icon="edit" onClick={() => handleAction(() => onEdit(doc.id))} />
                        <div className="border-t border-slate-100 my-1"></div>
                        <ActionMenuItem label="Delete Invoice" icon="trash" onClick={() => handleAction(() => onDelete(doc.id))} className="text-red-600 hover:bg-red-50" />
                    </div>
                </div>
            )}
        </div>
    );
};


interface DocumentTableProps {
  documents: Document[];
  folderId: string;
  onDelete: (docId: string) => void;
  onDownload: (docId: string) => void;
  onReprocess: (docId: string) => void;
  onEdit: (docId: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents, folderId, onDelete, onDownload, onReprocess, onEdit }) => {
    const navigate = useNavigate();
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 w-12 text-sm font-semibold text-slate-600 text-center">#</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Supplier</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Invoice #</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Payment</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Due Date</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {documents.length > 0 ? (
                    documents.map((doc, index) => (
                    <tr 
                        key={doc.id} 
                        className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/dashboard/folders/${folderId}/documents/${doc.id}`)}
                    >
                        <td className="p-4 text-sm text-slate-600 font-medium text-center">{(index + 1)}</td>
                        <td className="p-4 text-sm text-slate-800 font-medium">{doc.supplier}</td>
                        <td className="p-4 text-sm text-slate-600">{doc.invoiceNumber}</td>
                        <td className="p-4 text-sm text-slate-600">{formatDate(doc.date)}</td>
                        <td className="p-4 text-sm text-slate-600">{doc.currency} {doc.amount.toFixed(2)}</td>
                        <td className="p-4">
                            <StatusPill text={doc.status} type="processing" />
                        </td>
                        <td className="p-4">
                             <StatusPill text={doc.payment} type="payment" />
                        </td>
                        <td className="p-4 text-sm text-slate-600">{formatDate(doc.dueDate)}</td>
                        <td className="p-4 text-center">
                            <ActionMenu doc={doc} folderId={folderId} onDelete={onDelete} onDownload={onDownload} onReprocess={onReprocess} onEdit={onEdit} />
                        </td>
                    </tr>
                ))
                ) : (
                    <tr>
                        <td colSpan={9} className="text-center p-8 text-slate-500">
                            No documents found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentTable;