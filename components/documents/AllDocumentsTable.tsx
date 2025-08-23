import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../../types';
import Badge from '../ui/Badge';
import { Icon } from '../ui/Icon';

interface AllDocumentsTableProps {
  documents: (Document & { clientName: string })[];
  selectedDocuments: string[];
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (docId: string) => void;
  onEdit: (docId: string) => void;
  onDelete: (docId: string) => void;
}

const AllDocumentsTable: React.FC<AllDocumentsTableProps> = ({ documents, selectedDocuments, onSelectAll, onSelectOne, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB');

  const handleActionClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };
  
  const handleCheckboxClick = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    onSelectOne(docId);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 w-12 text-center">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" 
                onChange={onSelectAll} 
                checked={documents.length > 0 && selectedDocuments.length === documents.length} 
              />
            </th>
            <th className="p-4 text-sm font-semibold text-slate-600">Supplier</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Client</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Invoice #</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Due Date</th>
            <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr 
                key={doc.id} 
                className={`border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors group cursor-pointer ${selectedDocuments.includes(doc.id) ? 'bg-primary/5' : ''}`}
                onClick={() => navigate(`/dashboard/folders/${doc.folderId}/documents/${doc.id}`)}
              >
                <td className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" 
                    checked={selectedDocuments.includes(doc.id)}
                    onClick={(e) => handleCheckboxClick(e, doc.id)}
                    onChange={() => {}} // onChange is handled by onClick to avoid conflicts
                  />
                </td>
                <td className="p-4 text-sm text-slate-800 font-medium">{doc.supplier}</td>
                <td className="p-4 text-sm text-slate-600">{doc.clientName}</td>
                <td className="p-4 text-sm text-slate-600">{doc.invoiceNumber}</td>
                <td className="p-4"><Badge status={doc.status} /></td>
                <td className="p-4 text-sm text-slate-600">{formatDate(doc.dueDate)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-0 sm:space-x-2">
                     <button 
                      onClick={(e) => handleActionClick(e, () => navigate(`/dashboard/folders/${doc.folderId}/documents/${doc.id}`))} 
                      className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-100 transition-colors" 
                      aria-label={`View ${doc.invoiceNumber}`}
                    >
                        <Icon name="view" className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => handleActionClick(e, () => onEdit(doc.id))} 
                      className="p-2 text-slate-500 hover:text-green-600 rounded-full hover:bg-slate-100 transition-colors" 
                      aria-label={`Edit ${doc.invoiceNumber}`}
                    >
                        <Icon name="edit" className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => handleActionClick(e, () => onDelete(doc.id))} 
                      className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-100 transition-colors" 
                      aria-label={`Delete ${doc.invoiceNumber}`}
                    >
                        <Icon name="trash" className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
             <tr>
                <td colSpan={7} className="text-center p-8 text-slate-500">
                  No documents found.
                </td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllDocumentsTable;