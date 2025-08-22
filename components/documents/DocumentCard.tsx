import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../../types';
import Badge from '../ui/Badge';
import { Icon } from '../ui/Icon';

interface DocumentCardProps {
  document: Document;
  folderId: string;
  isSelected: boolean;
  onSelect: (docId: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, folderId, isSelected, onSelect }) => {
  const navigate = useNavigate();

  const getProcessingStatusColor = (status: DocumentProcessingStatus) =>
    status === DocumentProcessingStatus.Ready ? 'green' : status === DocumentProcessingStatus.ExportError ? 'red' : 'yellow';

  const handleCardClick = () => {
    navigate(`/dashboard/folders/${folderId}/documents/${document.id}`);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(document.id);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 cursor-pointer ${isSelected ? 'border-primary shadow-lg' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center" onClick={handleCheckboxClick}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary mr-3"
            />
            <Icon name="document-text" className="w-8 h-8 text-slate-400" />
          </div>
          <Badge color={getProcessingStatusColor(document.status)}>{document.status}</Badge>
        </div>
        <div>
          <p className="font-bold text-slate-800 truncate" title={document.supplier}>
            {document.supplier}
          </p>
          <p className="text-sm text-slate-500 font-mono">{document.invoiceNumber}</p>
        </div>
      </div>
      <div className="px-4 pb-4 mt-2 flex justify-between items-center text-sm">
        <p className="text-slate-500">
          Due: <span className="font-medium text-slate-700">{new Date(document.dueDate).toLocaleDateString('en-GB')}</span>
        </p>
        <p className="text-lg font-bold text-slate-800">
          ${document.amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default DocumentCard;