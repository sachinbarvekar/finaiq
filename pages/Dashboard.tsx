
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, IconName } from '../components/ui/Icon';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DocumentProcessingStatus } from '../types';
import { useProfile } from '../contexts/ProfileContext';
import { useDocuments } from '../contexts/DocumentContext';
import { useClients } from '../contexts/ClientContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';


// --- Page-specific components ---

const Trend: React.FC<{ value: number }> = ({ value }) => {
    const isPositive = value >= 0;
    return (
        <span className={`flex items-center text-xs font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <Icon name={isPositive ? 'arrow-trending-up' : 'arrow-trending-down'} className="w-4 h-4 mr-1" />
            {Math.abs(value)}% vs last week
        </span>
    );
};

// 1. Stat Card
interface StatCardProps {
    title: string;
    value: string;
    icon: IconName;
    trend: number;
    to: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, to }) => (
    <Link to={to} className="bg-white p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <Icon name={icon} className="w-6 h-6 text-slate-400" />
        </div>
        <div>
            <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
            <Trend value={trend} />
        </div>
    </Link>
);


// 2. Weekly Activity Chart (Area Chart)
const WeeklyActivityChart: React.FC = () => {
    const weeklyActivityData = [
      { day: 'Mon', processed: 210 }, { day: 'Tue', processed: 280 },
      { day: 'Wed', processed: 250 }, { day: 'Thu', processed: 310 },
      { day: 'Fri', processed: 350 }, { day: 'Sat', processed: 180 },
      { day: 'Sun', processed: 150 },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Weekly Processing Activity</h2>
            <div className="w-full flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false}/>
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={30}/>
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} cursor={{fill: 'rgba(79, 70, 229, 0.1)'}} />
                        <Area type="monotone" dataKey="processed" stroke="rgb(var(--color-primary))" fillOpacity={1} fill="url(#colorProcessed)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// 3. Document Processing Funnel
const DocumentFunnel: React.FC = () => {
    const funnelData = [
        { name: 'Ingested', value: 1250, color: 'bg-sky-500' },
        { name: 'Processed (AI)', value: 1180, color: 'bg-blue-500' },
        { name: 'Validated', value: 1050, color: 'bg-indigo-500' },
        { name: 'Exported', value: 980, color: 'bg-purple-500' },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Document Funnel</h2>
            <div className="flex-grow flex flex-col justify-center space-y-1">
                {funnelData.map((stage, index) => {
                    const nextValue = funnelData[index + 1]?.value || 0;
                    const percentage = index < funnelData.length - 1 ? ((nextValue / stage.value) * 100).toFixed(1) : null;
                    const widthPercentage = (stage.value / funnelData[0].value) * 100;

                    return (
                        <div key={stage.name} className="flex flex-col items-center">
                            <div className="flex items-center w-full">
                                <div className="flex-grow text-right pr-2">
                                    <p className="font-semibold text-slate-800 text-sm">{stage.name}</p>
                                    <p className="text-xs text-slate-500">{stage.value} docs</p>
                                </div>
                                <div className={`${stage.color} h-8 rounded`} style={{ width: `${widthPercentage}%` }} />
                            </div>
                            {percentage && (
                                <div className="text-xs text-slate-500 my-1">{percentage}% pass-through</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// 4. Recent Activity
const RecentActivity: React.FC = () => {
    const activityData = [
        { id: 1, type: 'upload', user: 'John Smith', detail: 'uploaded 5 invoices to Innovate Inc.', time: '2m ago', icon: 'upload' as IconName },
        { id: 2, type: 'approve', user: 'Admin', detail: 'approved INV-2024-007', time: '15m ago', icon: 'check-circle' as IconName },
        { id: 3, type: 'error', user: 'System', detail: 'failed to export 2 docs for Synergy', time: '1h ago', icon: 'x-circle' as IconName },
        { id: 4, type: 'new_client', user: 'Admin', detail: 'added a new client: Creative Minds', time: '4h ago', icon: 'user-plus' as IconName },
    ];
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
            <div className="flex-grow space-y-4 -mx-2 px-2 overflow-y-auto">
                {activityData.map(item => (
                    <div key={item.id} className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mr-3">
                            <Icon name={item.icon} className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-slate-800">
                                <span className="font-semibold">{item.user}</span> {item.detail}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// 5. Quick Actions
interface ActionCardProps {
    title: string;
    description: string;
    icon: IconName;
    to: string;
}
const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, to }) => (
    <Link to={to} className="flex items-start p-4 rounded-xl transition-all duration-200 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300">
        <div className="bg-white p-2 rounded-lg border border-slate-200 mr-4">
          <Icon name={icon} className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">{description}</p>
        </div>
    </Link>
);

const QuickActions: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Admin Quick Actions</h2>
        <div className="flex-grow flex flex-col justify-around space-y-3">
            <ActionCard to="/dashboard/clients" title="Client Management" description="Add, edit, and manage clients" icon="users" />
            <ActionCard to="/dashboard/settings" title="Settings" description="Configure app preferences" icon="settings" />
            <ActionCard to="/dashboard/workflows" title="Workflows" description="Automate processing rules" icon="workflow" />
        </div>
    </div>
);


// --- Admin Dashboard View ---

const AdminDashboard: React.FC = () => {
  const { currentUser } = useProfile();
  const { clients } = useClients();
  const { documents } = useDocuments();
  const pendingReviews = documents.filter(d => d.status === DocumentProcessingStatus.ReviewRequired).length;

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
        <p className="text-slate-500">Here's your performance summary for this week.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard to="/dashboard/clients" title="Total Clients" value={String(clients.length)} icon="users" trend={2.5} />
          <StatCard to="/dashboard/documents?status=all" title="Documents Processed" value={String(documents.length)} icon="document-text" trend={5.2} />
          <StatCard to={`/dashboard/documents?status=${DocumentProcessingStatus.ReviewRequired}`} title="Pending Reviews" value={String(pendingReviews)} icon="clock" trend={-1.8} />
          <StatCard to="/dashboard" title="Avg. Accuracy" value="98.7%" icon="target" trend={0.5} />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
            <WeeklyActivityChart />
        </div>
        <div className="lg:col-span-1 h-[400px]">
           <DocumentFunnel />
        </div>
        <div className="lg:col-span-2 h-[400px]">
            <RecentActivity />
        </div>
         <div className="lg:col-span-1 h-[400px]">
            <QuickActions />
        </div>
      </div>
    </div>
  );
};

// --- Client Dashboard View ---

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getClientById } = useClients();
  const { getDocumentsByFolderId, openImportModal } = useDocuments();

  if (!user || !user.clientId || !user.folderId) return null;
  
  const client = getClientById(user.clientId);
  const documents = getDocumentsByFolderId(user.folderId);
  const clientFolder = { id: user.folderId, folderName: client?.companyName || '' };

  const stats = {
      total: documents.length,
      pending: documents.filter(d => d.status === DocumentProcessingStatus.ReviewRequired).length,
      ready: documents.filter(d => d.status === DocumentProcessingStatus.Ready).length,
      errors: documents.filter(d => d.status === DocumentProcessingStatus.ExportError).length,
  };

  const chartData = [
    { name: 'Ready', value: stats.ready },
    { name: 'Pending', value: stats.pending },
    { name: 'Errors', value: stats.errors },
  ];
  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

  const recentDocuments = [...documents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const StatusProgress: React.FC<{title: string, count: number, total: number, color: string}> = ({title, count, total, color}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-slate-700">{title}</p>
            <p className="text-sm font-semibold text-slate-800">{count}</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className={`${color} h-1.5 rounded-full`} style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}></div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome, {user.name.split(' ')[0]}!</h1>
            <p className="text-slate-500">Here's a summary of your documents and actions.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                {/* Upload Area */}
                <div 
                    className="bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-slate-300 hover:border-primary hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                    onClick={() => openImportModal(clientFolder as any)}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full mb-3">
                            <Icon name="upload" className="w-6 h-6 text-slate-500"/>
                        </div>
                        <h3 className="font-bold text-slate-800">Upload Your Documents</h3>
                        <p className="text-sm text-slate-500">Drag & drop files here or click to browse.</p>
                    </div>
                </div>
                
                {/* Status Overview */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Processing Status</h3>
                    <div className="space-y-4">
                        <StatusProgress title="Pending Review" count={stats.pending} total={stats.total} color="bg-yellow-500" />
                        <StatusProgress title="Ready for Export" count={stats.ready} total={stats.total} color="bg-green-500" />
                        <StatusProgress title="Export Errors" count={stats.errors} total={stats.total} color="bg-red-500" />
                    </div>
                </div>

                 {/* Recent Documents */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                     <div className="space-y-2">
                        {recentDocuments.length > 0 ? recentDocuments.map(doc => (
                            <Link to={`/dashboard/folders/${doc.folderId}/documents/${doc.id}`} key={doc.id} className="block p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Icon name="document-text" className="w-5 h-5 text-slate-400 mr-3"/>
                                        <div>
                                            <p className="font-medium text-slate-800">{doc.supplier}</p>
                                            <p className="text-sm text-slate-500">#{doc.invoiceNumber} - ${doc.amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <Badge status={doc.status} />
                                </div>
                            </Link>
                        )) : (
                            <p className="text-slate-500 text-center py-4">No recent documents found.</p>
                        )}
                     </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
                 {/* Document Summary Chart */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Document Summary</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }}/>
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-slate-800">{stats.total}</text>
                                <text x="50%" y="50%" dy={20} textAnchor="middle" className="text-sm fill-slate-500">Total Docs</text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-around text-center mt-4">
                        {chartData.map((item, index) => (
                            <div key={item.name} className="flex items-center text-sm">
                                <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index]}}></span>
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                 </div>
                 {/* Quick Links */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h3>
                    <div className="space-y-2">
                        <Link to={`/dashboard/folders/${user.folderId}`} className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <Icon name="folder" className="w-5 h-5 text-primary mr-3"/>
                            <span className="font-medium text-slate-700">View All Documents</span>
                        </Link>
                        <Link to="/dashboard/profile" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <Icon name="user-circle" className="w-5 h-5 text-primary mr-3"/>
                            <span className="font-medium text-slate-700">Manage Your Profile</span>
                        </Link>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'Client') {
    return <ClientDashboard />;
  }

  // Fallback to AdminDashboard for admins or if role is not defined
  return <AdminDashboard />;
};

export default Dashboard;
