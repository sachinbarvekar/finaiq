
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Client, ClientStatus } from '../types';
import ClientTable from '../components/clients/ClientTable';
import Button from '../components/ui/Button';
import { Icon, IconName } from '../components/ui/Icon';
import Pagination from '../components/ui/Pagination';
import { useClients } from '../contexts/ClientContext';
import { useDocuments } from '../contexts/DocumentContext';
import { MOCK_ADMIN_USERS } from '../constants';
import NotFound from './NotFound';

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

const AdminDetailsPage: React.FC = () => {
    const { adminId } = useParams<{ adminId: string }>();
    const { clients, folders, openFormModal, deleteClient } = useClients();
    const { documents } = useDocuments();

    // Find the specific admin
    const admin = MOCK_ADMIN_USERS.find(a => a.id === adminId);
    
    // State for filtering and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ClientStatus | 'All'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    
    // --- Data Scoping ---
    const adminClients = useMemo(() => {
        return clients.filter(client => client.adminId === adminId);
    }, [clients, adminId]);

    const adminDocuments = useMemo(() => {
        const adminClientIds = adminClients.map(c => c.id);
        const adminFolderIds = folders.filter(f => adminClientIds.includes(f.clientId)).map(f => f.id);
        return documents.filter(doc => adminFolderIds.includes(doc.folderId));
    }, [documents, folders, adminClients]);

    // --- Client List Logic (similar to Clients.tsx) ---
    const filteredClients = useMemo(() => {
        return adminClients
          .filter(client => statusFilter === 'All' || client.status === statusFilter)
          .filter(client => {
            const search = searchTerm.toLowerCase();
            return (
              client.companyName.toLowerCase().includes(search) ||
              client.contactName.toLowerCase().includes(search) ||
              client.email.toLowerCase().includes(search)
            );
          });
    }, [adminClients, searchTerm, statusFilter]);

    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;
        return filteredClients.slice(startIndex, startIndex + CLIENTS_PER_PAGE);
    }, [filteredClients, currentPage]);

    const totalPages = Math.ceil(filteredClients.length / CLIENTS_PER_PAGE);

    const handleOpenEditModal = (clientId: string) => {
        const client = adminClients.find(c => c.id === clientId);
        if (client) openFormModal(client);
    };

    const handleDeleteClient = (clientId: string) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            deleteClient(clientId);
        }
    };
    
    if (!admin) {
        return <NotFound />;
    }

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <Link to="/dashboard/team" className="text-sm text-primary hover:underline flex items-center">
                    <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                    Back to Admins
                </Link>
            </div>

            {/* Admin Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6">
                <img src={admin.avatarUrl} alt={admin.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-200" />
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{admin.name}</h1>
                    <p className="text-slate-500">{admin.email}</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Clients" value={adminClients.length} icon="users" color="bg-blue-500" />
                <StatCard title="Total Documents" value={adminDocuments.length} icon="document-text" color="bg-green-500" />
                <StatCard title="Active Clients" value={adminClients.filter(c => c.status === 'Active').length} icon="check-circle" color="bg-teal-500" />
                <StatCard title="Pending Docs" value={adminClients.reduce((sum, c) => sum + c.pendingDocs, 0)} icon="clock" color="bg-yellow-500" />
            </div>

            {/* Client List */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Clients Managed by {admin.name.split(' ')[0]}</h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <ClientTable 
                        clients={paginatedClients} 
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteClient} 
                    />
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDetailsPage;
