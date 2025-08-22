
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../types';
import { MOCK_DOCUMENTS } from '../constants';
import { useClients } from './ClientContext';
import AddDocumentModal from '../components/documents/AddDocumentModal';
import ConfirmModal from '../components/ui/ConfirmModal';

interface DocumentContextType {
  documents: Document[];
  getDocumentsByFolderId: (folderId: string) => Document[];
  addDocument: (docData: Omit<Document, 'id' | 'folderId'>, folderId: string) => void;
  deleteDocument: (docId: string) => void;
  openAddModal: (folderId: string) => void;
  openDeleteModal: (docId: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const { updateFolder, getFolderById } = useClients();

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);

  const getDocumentsByFolderId = (folderId: string) => {
    return documents.filter(doc => doc.folderId === folderId);
  };

  const addDocument = (docData: Omit<Document, 'id' | 'folderId'>, folderId: string) => {
    const newDocument: Document = {
      ...docData,
      id: `D${(documents.length + 1).toString().padStart(3, '0')}`,
      folderId,
    };
    setDocuments(prev => [...prev, newDocument]);
    
    // Update document count in folder
    const folder = getFolderById(folderId);
    if (folder) {
        updateFolder(folderId, { documentCount: folder.documentCount + 1 });
    }
  };

  const deleteDocument = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setDocuments(prev => prev.filter(d => d.id !== docId));
      const folder = getFolderById(doc.folderId);
      if (folder) {
          updateFolder(doc.folderId, { documentCount: folder.documentCount - 1 });
      }
    }
  };

  // Modal handlers
  const openAddModal = (folderId: string) => {
    setTargetFolderId(folderId);
    setIsAddModalOpen(true);
  };
  
  const closeAddModal = () => {
    setTargetFolderId(null);
    setIsAddModalOpen(false);
  };
  
  const openDeleteModal = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setDocToDelete(doc);
      setIsDeleteModalOpen(true);
    }
  };
  
  const closeDeleteModal = () => {
    setDocToDelete(null);
    setIsDeleteModalOpen(false);
  };
  
  const handleConfirmDelete = () => {
      if (docToDelete) {
          deleteDocument(docToDelete.id);
      }
      closeDeleteModal();
  }

  const value = {
    documents,
    getDocumentsByFolderId,
    addDocument,
    deleteDocument,
    openAddModal,
    openDeleteModal,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
      {targetFolderId && (
        <AddDocumentModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={(data) => addDocument(data, targetFolderId)}
        />
      )}
      {docToDelete && (
        <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Delete Document"
            message={`Are you sure you want to delete invoice "${docToDelete.invoiceNumber}"? This action cannot be undone.`}
        />
      )}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
