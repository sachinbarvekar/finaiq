
import React, { useState, useMemo } from 'react';
import FolderCard from '../components/folders/FolderCard';
import { useClients } from '../contexts/ClientContext';
import Button from '../components/ui/Button';
import { Icon, IconName } from '../components/ui/Icon';
import Pagination from '../components/ui/Pagination';
import { FolderStatus, Folder } from '../types';
import { useDocuments } from '../contexts/DocumentContext';
import { useAuth } from '../contexts/AuthContext';

const FOLDERS_PER_PAGE = 8;

const StatCard: React.FC<{ title: string; value: number | string; icon: IconName; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon name={icon} className="w-5 h-5 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const Folders: React.FC = () => {
  const { clients, folders, openInviteModal, openPreferencesModal, openImportSettingsModal } = useClients();
  const { documents } = useDocuments();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FolderStatus | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  const adminFolders = useMemo(() => {
    const adminClientIds = clients.filter(c => c.adminId === user?.id).map(c => c.id);
    return folders.filter(folder => adminClientIds.includes(folder.clientId));
  }, [folders, clients, user]);

  const foldersWithDocCount = useMemo(() => {
    return adminFolders.map(folder => ({
      ...folder,
      documentCount: documents.filter(d => d.folderId === folder.id).length
    }));
  }, [adminFolders, documents]);

  const filteredFolders = useMemo(() => {
    return foldersWithDocCount
      .filter(folder => {
        if (statusFilter === 'All') return true;
        return folder.status === statusFilter;
      })
      .filter(folder => 
        folder.folderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [foldersWithDocCount, searchTerm, statusFilter]);

  const paginatedFolders = useMemo(() => {
    const startIndex = (currentPage - 1) * FOLDERS_PER_PAGE;
    return filteredFolders.slice(startIndex, startIndex + FOLDERS_PER_PAGE);
  }, [filteredFolders, currentPage]);
  
  const totalPages = Math.ceil(filteredFolders.length / FOLDERS_PER_PAGE);
  
  const adminDocuments = useMemo(() => {
    const adminFolderIds = adminFolders.map(f => f.id);
    return documents.filter(d => adminFolderIds.includes(d.folderId));
  }, [documents, adminFolders]);

  // Stats
  const totalFolders = adminFolders.length;
  const totalDocuments = adminDocuments.length;
  const pendingImports = adminFolders.filter(f => f.status === FolderStatus.PendingImport).length;
  const archivedFolders = adminFolders.filter(f => f.status === FolderStatus.Archived).length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Folder Management</h1>
        <Button onClick={() => openInviteModal()} leftIcon={<Icon name="user-plus" className="w-5 h-5"/>}>
          Invite users
        </Button>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Folders" value={totalFolders} icon="folder" color="bg-blue-500" />
        <StatCard title="Total Documents" value={totalDocuments} icon="document-text" color="bg-green-500" />
        <StatCard title="Pending Imports" value={pendingImports} icon="inbox" color="bg-yellow-500" />
        <StatCard title="Archived" value={archivedFolders} icon="archive" color="bg-slate-500" />
      </div>

      {/* Search and Filter */}
      <div className="mb-4 p-4 bg-white rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
             <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input
              type="text"
              placeholder="Search by folder name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as FolderStatus | 'All'); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Statuses</option>
              <option value={FolderStatus.Active}>Active</option>
              <option value={FolderStatus.PendingImport}>Pending Import</option>
              <option value={FolderStatus.Archived}>Archived</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedFolders.map((folder) => (
          <FolderCard 
            key={folder.id} 
            folder={folder} 
            openInviteModal={openInviteModal}
            openPreferencesModal={openPreferencesModal}
            openImportSettingsModal={openImportSettingsModal}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
        </div>
      )}

    </div>
  );
};

export default Folders;