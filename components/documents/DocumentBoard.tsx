
import React, { useState } from 'react';
import { Document, DocumentProcessingStatus } from '../../types';
import DocumentCard from './DocumentCard';

interface DocumentBoardProps {
  documents: Document[];
  onDocumentDrop: (docId: string, newStatus: DocumentProcessingStatus) => void;
}

const boardColumns: { status: DocumentProcessingStatus; title: string, color: string }[] = [
    { status: DocumentProcessingStatus.ReviewRequired, title: 'Review Required', color: 'border-yellow-500' },
    { status: DocumentProcessingStatus.Ready, title: 'Ready', color: 'border-green-500' },
    { status: DocumentProcessingStatus.ExportError, title: 'Export Error', color: 'border-red-500' },
];

const Column: React.FC<{ 
    status: DocumentProcessingStatus;
    title: string;
    color: string;
    documents: Document[];
    onDrop: (status: DocumentProcessingStatus, docId: string) => void;
}> = ({ status, title, color, documents, onDrop }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => setIsOver(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        const docId = e.dataTransfer.getData("documentId");
        if (docId) {
            onDrop(status, docId);
        }
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] h-full bg-slate-50 rounded-2xl transition-colors ${isOver ? 'bg-primary/10' : ''}`}
        >
            <div className={`p-4 border-b-4 ${color}`}>
                <h3 className="font-bold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-500">{documents.length} document(s)</p>
            </div>
            <div className="p-4 space-y-4 h-[calc(100%-80px)] overflow-y-auto">
                {documents.map(doc => (
                    <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
        </div>
    );
};

const DocumentBoard: React.FC<DocumentBoardProps> = ({ documents, onDocumentDrop }) => {

    const handleDrop = (docId: string, newStatus: DocumentProcessingStatus) => {
        onDocumentDrop(docId, newStatus);
    };

    return (
        <div className="flex space-x-4 p-4 h-[calc(100vh-320px)] overflow-x-auto">
            {boardColumns.map(col => (
                <Column 
                    key={col.status}
                    status={col.status}
                    title={col.title}
                    color={col.color}
                    documents={documents.filter(d => d.status === col.status)}
                    onDrop={(newStatus, docId) => {
                       handleDrop(docId, newStatus);
                    }}
                />
            ))}
        </div>
    );
};

export default DocumentBoard;
