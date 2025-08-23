
import React, { useState, useMemo } from 'react';
import { Client, ClientStatus } from '../types';
import ClientTable from '../components/clients/ClientTable';
import ConfirmModal from '../components/ui/ConfirmModal';
import Button from '../components/ui/Button';
import { Icon, IconName } from '../components/ui/Icon';
import Pagination from '../components/ui/Pagination';
import { useClients } from '../contexts/ClientContext';
import { useAuth } from '../contexts/AuthContext';

const CLIENTS_PER_PAGE = 5;

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

const Clients: React.FC = () => {
  const { clients, openFormModal, deleteClient } = useClients();
  const { user } = useAuth();
  
  // State for modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  const adminClients = useMemo(() => {
    return clients.filter(client => client.adminId === user?.id);
  }, [clients, user]);

  // Memoized filtering and searching
  const filteredClients = useMemo(() => {
    return adminClients
      .filter(client => {
        if (statusFilter === 'All') return true;
        return client.status === statusFilter;
      })
      .filter(client => {
        const search = searchTerm.toLowerCase();
        return (
          client.companyName.toLowerCase().includes(search) ||
          client.contactName.toLowerCase().includes(search) ||
          client.email.toLowerCase().includes(search)
        );
      });
  }, [adminClients, searchTerm, statusFilter]);

  // Memoized pagination
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;
    return filteredClients.slice(startIndex, startIndex + CLIENTS_PER_PAGE);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / CLIENTS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as ClientStatus | 'All');
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleOpenAddModal = () => {
    openFormModal();
  };

  const handleOpenEditModal = (clientId: string) => {
    const client = adminClients.find(c => c.id === clientId);
    if (client) {
      openFormModal(client);
    }
  };
  
  const handleOpenDeleteModal = (clientId: string) => {
    const client = adminClients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedClient(null);
  };

  const handleConfirmDelete = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      handleCloseDeleteModal();
    }
  };
  
  const totalClients = adminClients.length;
  const activeClients = adminClients.filter(c => c.status === ClientStatus.Active).length;
  const inactiveClients = adminClients.filter(c => c.status === ClientStatus.Inactive).length;
  const needsReview = adminClients.filter(c => c.pendingDocs > 10).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Clients Overview</h1>
        <Button onClick={handleOpenAddModal} leftIcon={<Icon name="plus" className="w-5 h-5"/>}>
          Add New Client
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Clients" value={totalClients} icon="users" color="bg-blue-500" />
        <StatCard title="Active Clients" value={activeClients} icon="check-circle" color="bg-green-500" />
        <StatCard title="Inactive Clients" value={inactiveClients} icon="x-circle" color="bg-slate-500" />
        <StatCard title="Needs Review" value={needsReview} icon="exclamation-circle" color="bg-yellow-500" />
      </div>


      {/* Search and Filter Controls */}
      <div className="mb-4 p-4 bg-white rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
             <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Statuses</option>
              <option value={ClientStatus.Active}>Active</option>
              <option value={ClientStatus.Inactive}>Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Table and Pagination Container */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <ClientTable 
          clients={paginatedClients} 
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal} 
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>


      {/* Modals */}
      {selectedClient && (
        <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Delete Client"
            message={`Are you sure you want to delete the client "${selectedClient.companyName}"? This action cannot be undone.`}
        />
      )}

    </div>
  );
};

export default Clients;