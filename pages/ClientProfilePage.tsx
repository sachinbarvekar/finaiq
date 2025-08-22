import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ClientStatus } from '../types';
import NotFound from './NotFound';
import { Icon, IconName } from '../components/ui/Icon';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useClients } from '../contexts/ClientContext';
import ConfirmModal from '../components/ui/ConfirmModal';

// --- Reusable Components for this Page ---

const Stat: React.FC<{ value: number; label: string; color: string; icon: IconName }> = ({ value, label, color, icon }) => (
    <div className="flex items-center">
        <Icon name={icon} className={`w-5 h-5 ${color} mr-2`} />
        <div>
            <p className="font-bold text-xl text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 uppercase">{label}</p>
        </div>
    </div>
);

const InfoItem: React.FC<{ label: string; value: string; isLink?: boolean }> = ({ label, value, isLink }) => (
    <div>
        <p className="text-sm text-slate-500">{label}</p>
        {isLink ? (
            <a href={label === 'Email Address' ? `mailto:${value}`: '#'} className="font-medium text-primary hover:underline">{value}</a>
        ) : (
            <p className="font-medium text-slate-800">{value}</p>
        )}
    </div>
);

const AnalyticsCard: React.FC<{ value: number; label: string; description: string; color: string; icon: IconName }> = ({ value, label, description, color, icon }) => (
    <div className={`p-5 rounded-xl bg-white border-l-4 ${color} shadow-sm`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="font-semibold text-slate-600">{label}</p>
            </div>
            <Icon name={icon} className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500 mt-2">{description}</p>
    </div>
);


const ClientProfilePage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { getClientById, updateClient, deleteClient, openFormModal, openIntegrationModal } = useClients();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const client = clientId ? getClientById(clientId) : undefined;

  if (!client) {
    return <NotFound />;
  }

  const handleArchive = () => {
    const newStatus = client.status === ClientStatus.Active ? ClientStatus.Inactive : ClientStatus.Active;
    updateClient(client.id, { status: newStatus });
  };

  const handleDelete = () => {
    deleteClient(client.id);
    navigate('/clients');
  };

  const totalDocuments = client.approvedDocs + client.pendingDocs + client.rejectedDocs;
  const isConnected = client.integration && client.integration !== 'No integration connected';

  return (
    <div className="space-y-6">
        <div className="mb-4">
             <Link to="/clients" className="text-sm text-primary hover:underline flex items-center">
                <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                Back to Clients
            </Link>
        </div>

        {/* --- Header --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-primary text-white flex items-center justify-center rounded-full text-2xl font-bold mr-4">
                        {client.companyName.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-slate-800">{client.companyName}</h1>
                             <Badge color={client.status === ClientStatus.Active ? 'green' : 'gray'}>
                                {client.status}
                            </Badge>
                        </div>
                        <div className="flex items-center text-sm text-slate-500 gap-4">
                           <span>{client.email}</span>
                           <span>{client.phone}</span>
                        </div>
                         <div className="flex items-center text-sm text-slate-500 gap-4 mt-1">
                           <span>{totalDocuments} documents</span>
                           <span>&bull;</span>
                           <span>Active since {new Date(client.accountCreated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
                 <div className="flex items-center space-x-6 mt-4 md:mt-0">
                    <Stat value={client.approvedDocs} label="Approved" color="text-green-500" icon="check-circle" />
                    <Stat value={client.pendingDocs} label="Pending" color="text-yellow-500" icon="clock" />
                    <Stat value={client.rejectedDocs} label="Rejected" color="text-red-500" icon="x-circle" />
                    <button className="p-2 rounded-full hover:bg-slate-100">
                        <Icon name="chevron-up" className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </div>
            {/* --- Action Buttons --- */}
            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap gap-3">
                <Button variant="secondary" leftIcon={<Icon name="link" className="w-4 h-4"/>} onClick={() => openIntegrationModal(client)}>
                    {isConnected ? `Connected: ${client.integration}` : 'Connect Integration'}
                </Button>
                <Button variant="secondary" leftIcon={<Icon name="document-text" className="w-4 h-4"/>}>Manage Documents</Button>
                <Button variant="secondary" leftIcon={<Icon name="edit" className="w-4 h-4"/>} onClick={() => openFormModal(client)}>Edit Client</Button>
                <Button variant="secondary" leftIcon={<Icon name="archive" className="w-4 h-4"/>} onClick={handleArchive}>
                    {client.status === ClientStatus.Active ? 'Archive Client' : 'Activate Client'}
                </Button>
                <Button variant="danger" leftIcon={<Icon name="trash" className="w-4 h-4"/>} onClick={() => setIsDeleteModalOpen(true)}>Delete Client</Button>
            </div>
        </div>

        {/* --- Main Content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                 <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Icon name="user-circle" className="w-6 h-6 mr-2 text-primary" />
                    Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InfoItem label="Contact Person" value={client.contactName} />
                    <InfoItem label="Email Address" value={client.email} isLink />
                    <InfoItem label="Phone Number" value={client.phone} />
                    <InfoItem label="Business Address" value={client.address || '-'} />
                    <div>
                        <p className="text-sm text-slate-500">Folder ID</p>
                        <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{client.folderId}</span>
                    </div>
                    <InfoItem label="Integration" value={client.integration} />
                </div>
            </div>

            {/* Right Column */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Icon name="chart-pie" className="w-6 h-6 mr-2 text-primary" />
                    Account Information
                </h2>
                <div className="space-y-4">
                    <InfoItem label="Account Created" value={new Date(client.accountCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                    <InfoItem label="Last Activity" value={new Date(client.lastActivity).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                    <InfoItem label="Monthly Growth" value={`${client.monthlyGrowth}%`} />
                    <div>
                        <p className="text-sm text-slate-500">Notes</p>
                        <div className="w-full p-3 bg-slate-50 rounded-lg text-sm text-slate-700 min-h-[60px]">
                            {client.notes || 'No notes provided.'}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Document Analytics --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Icon name="document-report" className="w-6 h-6 mr-2 text-primary" />
                Document Analytics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsCard value={totalDocuments} label="Total Documents" description="All documents processed" color="border-blue-500" icon="document-text" />
                <AnalyticsCard value={client.pendingDocs} label="Awaiting Review" description="Awaiting approval" color="border-yellow-500" icon="calendar" />
                <AnalyticsCard value={client.approvedDocs} label="Approved" description="Successfully processed" color="border-green-500" icon="check-circle" />
                <AnalyticsCard value={client.rejectedDocs} label="Rejected" description="Requires attention" color="border-red-500" icon="exclamation-circle" />
            </div>
        </div>
         <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Client"
            message={`Are you sure you want to delete the client "${client.companyName}"? This action cannot be undone.`}
        />
    </div>
  );
};

export default ClientProfilePage;
