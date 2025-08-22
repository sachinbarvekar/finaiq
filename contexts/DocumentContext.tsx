
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Document, Folder } from '../types';
import { MOCK_DOCUMENTS } from '../constants';
import { useClients } from './ClientContext';
import ImportDocumentsModal from '../components/documents/ImportDocumentsModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import EditDocumentModal from '../components/documents/EditDocumentModal';

interface DocumentContextType {
  documents: Document[];
  getDocumentById: (docId: string) => Document | undefined;
  getDocumentsByFolderId: (folderId: string) => Document[];
  addDocument: (docData: Omit<Document, 'id' | 'folderId'>, folderId: string) => void;
  updateDocument: (docId: string, docData: Partial<Omit<Document, 'id'>>) => void;
  deleteDocument: (docId: string) => void;
  openImportModal: (folder: Folder) => void;
  openDeleteModal: (docId: string, onSuccess?: () => void) => void;
  openEditModal: (docId: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const { updateFolder, getFolderById } = useClients();

  // Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [targetFolder, setTargetFolder] = useState<Folder | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);
  const [onDeleteSuccess, setOnDeleteSuccess] = useState<(() => void) | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [docToEdit, setDocToEdit] = useState<Document | null>(null);

  const getDocumentsByFolderId = (folderId: string) => {
    return documents.filter(doc => doc.folderId === folderId);
  };
  
  const getDocumentById = (docId: string) => {
    return documents.find(doc => doc.id === docId);
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

  const updateDocument = (docId: string, docData: Partial<Omit<Document, 'id'>>) => {
    setDocuments(prev => prev.map(doc => doc.id === docId ? { ...doc, ...docData } : doc));
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
  const openImportModal = (folder: Folder) => {
    setTargetFolder(folder);
    setIsImportModalOpen(true);
  };
  
  const closeImportModal = () => {
    setTargetFolder(null);
    setIsImportModalOpen(false);
  };
  
  const openDeleteModal = (docId: string, onSuccess?: () => void) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setDocToDelete(doc);
      setOnDeleteSuccess(() => onSuccess); // Store the callback
      setIsDeleteModalOpen(true);
    }
  };
  
  const closeDeleteModal = () => {
    setDocToDelete(null);
    setOnDeleteSuccess(null);
    setIsDeleteModalOpen(false);
  };
  
  const openEditModal = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
        setDocToEdit(doc);
        setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
      setDocToEdit(null);
      setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
      if (docToDelete) {
          deleteDocument(docToDelete.id);
          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
      }
      closeDeleteModal();
  }

  const value = {
    documents,
    getDocumentById,
    getDocumentsByFolderId,
    addDocument,
    updateDocument,
    deleteDocument,
    openImportModal,
    openDeleteModal,
    openEditModal,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
      <ImportDocumentsModal
          isOpen={isImportModalOpen}
          onClose={closeImportModal}
          folder={targetFolder}
        />
      {docToDelete && (
        <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Delete Document"
            message={`Are you sure you want to delete invoice "${docToDelete.invoiceNumber}"? This action cannot be undone.`}
        />
      )}
      {docToEdit && (
        <EditDocumentModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={(data) => {
            updateDocument(docToEdit.id, data);
            closeEditModal();
          }}
          documentToEdit={docToEdit}
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