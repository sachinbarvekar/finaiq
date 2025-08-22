import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../../types';
import { Icon } from '../ui/Icon';
import Badge from '../ui/Badge';

const ActionMenu: React.FC<{ 
    doc: Document; 
    folderId: string;
    onEdit: (docId: string) => void;
    onDelete: (docId: string) => void;
    onReprocess: (docId: string) => void;
}> = ({ doc, folderId, onEdit, onDelete, onReprocess }) => {
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

    const handleActionClick = (e: React.MouseEvent, callback: () => void) => {
        e.stopPropagation();
        callback();
        setIsOpen(false);
    }
    
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
                <Icon name="dots-vertical" className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-1">
                    <button onClick={(e) => handleActionClick(e, () => navigate(`/dashboard/folders/${folderId}/documents/${doc.id}`))} className="flex items-center w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-100 rounded-md"><Icon name="view" className="w-4 h-4 mr-2"/>View</button>
                    <button onClick={(e) => handleActionClick(e, () => onEdit(doc.id))} className="flex items-center w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-100 rounded-md"><Icon name="edit" className="w-4 h-4 mr-2"/>Edit</button>
                    <button onClick={(e) => handleActionClick(e, () => onReprocess(doc.id))} className="flex items-center w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-100 rounded-md"><Icon name="reprocess" className="w-4 h-4 mr-2"/>Reprocess</button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button onClick={(e) => handleActionClick(e, () => onDelete(doc.id))} className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-md"><Icon name="trash" className="w-4 h-4 mr-2"/>Delete</button>
                </div>
            )}
        </div>
    );
};


interface DocumentTableProps {
  documents: Document[];
  folderId: string;
  selectedDocuments: string[];
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (docId: string) => void;
  onEdit: (docId: string) => void;
  onDelete: (docId: string) => void;
  onReprocess: (docId: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents, folderId, selectedDocuments, onSelectAll, onSelectOne, onEdit, onDelete, onReprocess }) => {
    const navigate = useNavigate();
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB');

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 w-12 text-center">
                          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" onChange={onSelectAll} checked={documents.length > 0 && selectedDocuments.length === documents.length} />
                        </th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Supplier</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Invoice #</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Payment</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Due Date</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {documents.map((doc) => (
                    <tr 
                        key={doc.id} 
                        className={`border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer ${selectedDocuments.includes(doc.id) ? 'bg-primary/5' : ''}`}
                        onClick={() => navigate(`/dashboard/folders/${folderId}/documents/${doc.id}`)}
                    >
                        <td className="p-4 w-12 text-center" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" onChange={() => onSelectOne(doc.id)} checked={selectedDocuments.includes(doc.id)} />
                        </td>
                        <td className="p-4 text-sm text-slate-800 font-medium">{doc.supplier}</td>
                        <td className="p-4 text-sm text-slate-600">{doc.invoiceNumber}</td>
                        <td className="p-4 text-sm text-slate-600 font-mono">{doc.currency} {doc.amount.toFixed(2)}</td>
                        <td className="p-4"><Badge status={doc.status} /></td>
                        <td className="p-4"><Badge status={doc.payment} /></td>
                        <td className="p-4 text-sm text-slate-600">{formatDate(doc.dueDate)}</td>
                        <td className="p-4 text-center">
                            <ActionMenu doc={doc} folderId={folderId} onEdit={onEdit} onDelete={onDelete} onReprocess={onReprocess} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentTable;