
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Client, ClientStatus, Folder, FolderStatus } from '../types';
import { MOCK_CLIENTS, MOCK_FOLDERS } from '../constants';
import ClientFormModal from '../components/clients/ClientFormModal';
import IntegrationModal from '../components/clients/IntegrationModal';
import InviteUserModal from '../components/folders/InviteUserModal';
import FolderPreferencesModal from '../components/folders/FolderPreferencesModal';
import ImportSettingsModal from '../components/folders/ImportSettingsModal';

interface ClientContextType {
  clients: Client[];
  getClientById: (id: string) => Client | undefined;
  addClient: (clientData: Omit<Client, 'id' | 'status' | 'accountCreated' | 'lastActivity' | 'monthlyGrowth' | 'folderId' | 'integration' | 'approvedDocs' | 'pendingDocs' | 'rejectedDocs'>) => void;
  updateClient: (clientId: string, clientData: Partial<Omit<Client, 'id'>>) => void;
  deleteClient: (clientId: string) => void;
  // Form Modal
  openFormModal: (client?: Client) => void;
  closeFormModal: () => void;
  // Integration Modal
  openIntegrationModal: (client: Client) => void;
  closeIntegrationModal: () => void;
  // Invite User Modal
  openInviteModal: (folderId?: string) => void;
  closeInviteModal: () => void;
  // Folder Management
  folders: Folder[];
  getFolderById: (id: string) => Folder | undefined;
  updateFolder: (folderId: string, folderData: Partial<Omit<Folder, 'id'>>) => void;
  // Folder Modals
  openPreferencesModal: (folder: Folder) => void;
  closePreferencesModal: () => void;
  openImportSettingsModal: (folder: Folder) => void;
  closeImportSettingsModal: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS);
  
  // Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // Integration Modal State
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [clientForIntegration, setClientForIntegration] = useState<Client | null>(null);

  // Invite User Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [initialFolderId, setInitialFolderId] = useState<string | undefined>(undefined);

  // Folder Modals State
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [isImportSettingsModalOpen, setIsImportSettingsModalOpen] = useState(false);
  const [folderForModal, setFolderForModal] = useState<Folder | null>(null);

  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getFolderById = (id: string) => folders.find(f => f.id === id);

  // Form Modal Logic
  const openFormModal = (client?: Client) => {
    setClientToEdit(client || null);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setClientToEdit(null);
  };

  // Integration Modal Logic
  const openIntegrationModal = (client: Client) => {
    setClientForIntegration(client);
    setIsIntegrationModalOpen(true);
  };

  const closeIntegrationModal = () => {
    setClientForIntegration(null);
    setIsIntegrationModalOpen(false);
  };

  // Invite User Modal Logic
  const openInviteModal = (folderId?: string) => {
    setInitialFolderId(folderId);
    setIsInviteModalOpen(true);
  };
  const closeInviteModal = () => {
    setInitialFolderId(undefined);
    setIsInviteModalOpen(false);
  };

  // Folder Preferences Modal Logic
  const openPreferencesModal = (folder: Folder) => {
      setFolderForModal(folder);
      setIsPreferencesModalOpen(true);
  };
  const closePreferencesModal = () => {
      setFolderForModal(null);
      setIsPreferencesModalOpen(false);
  };

  // Import Settings Modal Logic
  const openImportSettingsModal = (folder: Folder) => {
      setFolderForModal(folder);
      setIsImportSettingsModalOpen(true);
  };
  const closeImportSettingsModal = () => {
      setFolderForModal(null);
      setIsImportSettingsModalOpen(false);
  };


  // Client and Folder Data Logic
  const addClient = (clientData: Omit<Client, 'id' | 'status' | 'accountCreated' | 'lastActivity' | 'monthlyGrowth' | 'folderId' | 'integration' | 'approvedDocs' | 'pendingDocs' | 'rejectedDocs'>) => {
      const newClientId = `C${(clients.length + 1).toString().padStart(3, '0')}`;
      const newFolderId = `F${(folders.length + 1).toString().padStart(3, '0')}`;

      const newClient: Client = {
        ...clientData,
        id: newClientId,
        status: ClientStatus.Active,
        accountCreated: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
        monthlyGrowth: 0,
        folderId: newFolderId,
        integration: 'No integration connected',
        approvedDocs: 0,
        pendingDocs: 0,
        rejectedDocs: 0,
      };
      setClients(prev => [...prev, newClient]);

      const newFolder: Folder = {
        id: newFolderId,
        folderName: newClient.companyName,
        documentCount: 0,
        status: FolderStatus.Active,
        clientId: newClientId,
      };
      setFolders(prev => [...prev, newFolder]);
  };

  const updateClient = (clientId: string, clientData: Partial<Omit<Client, 'id'>>) => {
    let updatedClient: Client | null = null;
    setClients(clients.map(c => {
      if (c.id === clientId) {
        updatedClient = { ...c, ...clientData };
        return updatedClient;
      }
      return c;
    }));

    if (updatedClient && clientData.companyName) {
        setFolders(folders.map(f => f.clientId === clientId ? { ...f, folderName: clientData.companyName } : f));
    }
  };
  
  const deleteClient = (clientId: string) => {
    const clientToDelete = getClientById(clientId);
    setClients(clients.filter(client => client.id !== clientId));
    if (clientToDelete) {
        setFolders(folders.filter(folder => folder.clientId !== clientId));
    }
  };

  const updateFolder = (folderId: string, folderData: Partial<Omit<Folder, 'id'>>) => {
    setFolders(folders.map(f => f.id === folderId ? { ...f, ...folderData } : f));
  };

  const handleFormSubmit = (clientData: Omit<Client, 'id' | 'status' | 'accountCreated' | 'lastActivity' | 'monthlyGrowth' | 'folderId' | 'integration' | 'approvedDocs' | 'pendingDocs' | 'rejectedDocs'>) => {
    if (clientToEdit) {
      updateClient(clientToEdit.id, clientData);
    } else {
      addClient(clientData);
    }
    closeFormModal();
  };

  const handleSetIntegration = (integrationName: string) => {
    if(clientForIntegration) {
      updateClient(clientForIntegration.id, { integration: integrationName });
    }
    closeIntegrationModal();
  };
  
  const handleUpdateFolder = (folderId: string, folderData: Partial<Omit<Folder, 'id'>>) => {
    updateFolder(folderId, folderData);
  }

  const value = {
    clients,
    getClientById,
    addClient,
    updateClient,
    deleteClient,
    openFormModal,
    closeFormModal,
    openIntegrationModal,
    closeIntegrationModal,
    openInviteModal,
    closeInviteModal,
    folders,
    getFolderById,
    updateFolder,
    openPreferencesModal,
    closePreferencesModal,
    openImportSettingsModal,
    closeImportSettingsModal,
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
      <ClientFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        clientToEdit={clientToEdit}
      />
      <IntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={closeIntegrationModal}
        onConnect={handleSetIntegration}
        client={clientForIntegration}
      />
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        folders={folders}
        initialFolderId={initialFolderId}
      />
      <FolderPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={closePreferencesModal}
        folder={folderForModal}
        onUpdateFolder={handleUpdateFolder}
      />
      <ImportSettingsModal
        isOpen={isImportSettingsModalOpen}
        onClose={closeImportSettingsModal}
        folder={folderForModal}
      />
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};
