import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import NotFound from './NotFound';
import { Icon, IconName } from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string; }> = ({ title, children, className }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm ${className}`}>
        <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
        {children}
    </div>
);

const InfoItem: React.FC<{ label: string; value: string; icon: IconName; }> = ({ label, value, icon }) => (
    <div className="flex items-start">
        <Icon name={icon} className="w-5 h-5 text-slate-400 mt-1 mr-4 flex-shrink-0" />
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="font-medium text-slate-800">{value}</p>
        </div>
    </div>
);

const ClientProfilePage: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const { getClientById, openFormModal, openIntegrationModal } = useClients();

    const client = clientId ? getClientById(clientId) : undefined;

    if (!client) {
        return <NotFound />;
    }

    const documentData = [
        { name: 'Approved', value: client.approvedDocs },
        { name: 'Pending', value: client.pendingDocs },
        { name: 'Rejected', value: client.rejectedDocs },
    ];
    const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <Link to="/dashboard/clients" className="text-sm text-primary hover:underline flex items-center">
                    <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                    Back to Clients
                </Link>
            </div>
            
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{client.companyName}</h1>
                    <p className="text-slate-500">{client.status} Client since {new Date(client.accountCreated).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => openFormModal(client)}>Edit Client</Button>
                    <Link to={`/dashboard/folders/${client.folderId}`}>
                        <Button variant="primary">Manage Documents</Button>
                    </Link>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <InfoCard title="Contact Information">
                        <div className="space-y-4">
                            <InfoItem label="Contact Name" value={client.contactName} icon="user-circle" />
                            <InfoItem label="Email Address" value={client.email} icon="inbox" />
                            <InfoItem label="Phone Number" value={client.phone} icon="phone" />
                            <InfoItem label="Address" value={client.address || 'N/A'} icon="location-marker" />
                        </div>
                    </InfoCard>
                    <InfoCard title="Account Details">
                         <div className="space-y-4">
                            <InfoItem label="Last Activity" value={new Date(client.lastActivity).toLocaleDateString()} icon="calendar" />
                            <InfoItem label="Monthly Growth" value={`${client.monthlyGrowth}%`} icon="chart-bar" />
                        </div>
                    </InfoCard>
                </div>

                <div className="lg:col-span-2 space-y-6">
                     <InfoCard title="Document Overview">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={documentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {documentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }}/>
                                     <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-slate-800">
                                        {client.approvedDocs + client.pendingDocs + client.rejectedDocs}
                                    </text>
                                     <text x="50%" y="50%" dy={20} textAnchor="middle" className="text-sm fill-slate-500">
                                        Total Docs
                                    </text>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center mt-4">
                            <div><p className="font-bold text-lg text-green-600">{client.approvedDocs}</p><p className="text-sm text-slate-500">Approved</p></div>
                            <div><p className="font-bold text-lg text-yellow-600">{client.pendingDocs}</p><p className="text-sm text-slate-500">Pending</p></div>
                            <div><p className="font-bold text-lg text-red-600">{client.rejectedDocs}</p><p className="text-sm text-slate-500">Rejected</p></div>
                        </div>
                     </InfoCard>
                     <InfoCard title="Integrations">
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">{client.integration}</p>
                                <p className="text-sm text-slate-500">Connect to ERP & accounting software.</p>
                            </div>
                            <Button variant="outline" onClick={() => openIntegrationModal(client)}>
                                {client.integration === 'No integration connected' ? 'Connect' : 'Manage'}
                            </Button>
                         </div>
                     </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default ClientProfilePage;