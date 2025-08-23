import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../../types';
import Badge from '../ui/Badge';
import { Icon } from '../ui/Icon';

const ActionMenu: React.FC<{ 
    doc: Document; 
    onEdit: (docId: string) => void;
    onDelete: (docId: string) => void;
    onReprocess: (docIds: string[]) => void;
}> = ({ doc, onEdit, onDelete, onReprocess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
                <div className="origin-top-right absolute right-0 -mt-2 w-40 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-1">
                    <button onClick={(e) => handleActionClick(e, () => onEdit(doc.id))} className="flex items-center w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-100 rounded-md"><Icon name="edit" className="w-4 h-4 mr-2"/>Edit</button>
                    <button onClick={(e) => handleActionClick(e, () => onReprocess([doc.id]))} className="flex items-center w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-100 rounded-md"><Icon name="reprocess" className="w-4 h-4 mr-2"/>Reprocess</button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button onClick={(e) => handleActionClick(e, () => onDelete(doc.id))} className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-md"><Icon name="trash" className="w-4 h-4 mr-2"/>Delete</button>
                </div>
            )}
        </div>
    );
};

interface DocumentCardProps {
  document: Document;
  folderId?: string;
  clientName?: string; // New optional prop
  isSelected?: boolean;
  onSelect?: (docId: string) => void;
  onEdit?: (docId: string) => void;
  onDelete?: (docId: string) => void;
  onReprocess?: (docIds: string[]) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, folderId, clientName, isSelected, onSelect, onEdit, onDelete, onReprocess }) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const handleCardClick = () => {
    if (folderId) {
        navigate(`/dashboard/folders/${folderId}/documents/${document.id}`);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(document.id);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("documentId", document.id);
    setIsDragging(true);
  }

  const handleDragEnd = () => {
    setIsDragging(false);
  }

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-2xl shadow-sm border-2 flex flex-col transition-all duration-200 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 ring-2 ring-primary' : ''} ${isSelected ? 'border-primary shadow-lg' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
    >
      <div className="p-4 flex-grow" onClick={handleCardClick}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center" onClick={onSelect ? handleCheckboxClick : undefined}>
            {onSelect && <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary mr-3"
            />}
            <Icon name="document-text" className="w-8 h-8 text-slate-400" />
          </div>
          <Badge status={document.status} />
        </div>
        <div>
          <p className="font-bold text-slate-800 truncate" title={document.supplier}>
            {document.supplier}
          </p>
          <p className="text-sm text-slate-500 font-mono">{document.invoiceNumber}</p>
          {clientName && (
            <p className="text-xs text-slate-400 mt-1 truncate" title={clientName}>
              <Icon name="folder" className="w-3 h-3 inline-block mr-1" />
              {clientName}
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-slate-200 p-3 flex justify-between items-center text-sm">
        <p className="text-lg font-bold text-slate-800">
          ${document.amount.toFixed(2)}
        </p>
        {onEdit && onDelete && onReprocess && <ActionMenu doc={document} onEdit={onEdit} onDelete={onDelete} onReprocess={onReprocess} />}
      </div>
    </div>
  );
};

export default DocumentCard;