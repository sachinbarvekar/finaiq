
import React from 'react';
import { Icon, IconName } from '../components/ui/Icon';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const StatCard: React.FC<{ title: string; value: string; icon: IconName; }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <Icon name={icon} className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
);

const ServiceStatus: React.FC<{ name: string; status: 'Operational' | 'Degraded' | 'Outage' }> = ({ name, status }) => {
    const statusConfig = {
        Operational: { text: 'text-green-600', bg: 'bg-green-100', icon: 'check-circle' as IconName },
        Degraded: { text: 'text-yellow-600', bg: 'bg-yellow-100', icon: 'exclamation-circle' as IconName },
        Outage: { text: 'text-red-600', bg: 'bg-red-100', icon: 'x-circle' as IconName },
    };
    const config = statusConfig[status];
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <p className="font-medium text-slate-700">{name}</p>
            <div className={`flex items-center text-sm font-semibold ${config.text}`}>
                <Icon name={config.icon} className="w-4 h-4 mr-2" />
                {status}
            </div>
        </div>
    );
};

const apiRequestData = [
    { time: '12:00', requests: 2400 }, { time: '13:00', requests: 1398 },
    { time: '14:00', requests: 9800 }, { time: '15:00', requests: 3908 },
    { time: '16:00', requests: 4800 }, { time: '17:00', requests: 3800 },
    { time: '18:00', requests: 4300 },
];


const SystemHealthPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">System Health</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="API Uptime (24h)" value="99.98%" icon="trending-up" />
                <StatCard title="Avg. Processing Time" value="1.8s" icon="clock" />
                <StatCard title="API Error Rate" value="0.02%" icon="exclamation-circle" />
                <StatCard title="Active Users (1h)" value="241" icon="users" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm h-[400px]">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">API Requests (Last 24 hours)</h2>
                     <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={apiRequestData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                             <defs>
                                <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={30}/>
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} />
                            <Area type="monotone" dataKey="requests" stroke="rgb(var(--color-primary))" fill="url(#colorApi)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm h-[400px]">
                     <h2 className="text-xl font-bold text-slate-800 mb-4">Service Status</h2>
                     <div className="space-y-3">
                        <ServiceStatus name="Web Application" status="Operational" />
                        <ServiceStatus name="API Gateway" status="Operational" />
                        <ServiceStatus name="AI Processing" status="Operational" />
                        <ServiceStatus name="Database" status="Operational" />
                        <ServiceStatus name="Integrations" status="Degraded" />
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthPage;
