import React from 'react';
import { Icon, IconName } from '../components/ui/Icon';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';


// --- Page-specific components ---

// 1. Stat Card
interface StatCardProps {
    title: string;
    value: string;
    icon: IconName;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

// 2. User Processing Chart
const userProcessingData = [
    { name: 'John Smith', docs: 142 },
    { name: 'Sarah Johnson', docs: 98 },
    { name: 'Mike Davis', docs: 87 },
    { name: 'Lisa Wilson', docs: 76 },
    { name: 'David Brown', docs: 65 },
    { name: 'Emma Taylor', docs: 45 },
];

const UserProcessingChart: React.FC = () => {
    const maxDocs = 160;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4">User Document Processing</h2>
            <div className="space-y-4">
                {userProcessingData.map(user => (
                    <div key={user.name} className="flex items-center group">
                        <span className="text-sm font-medium text-slate-600 w-28 text-right pr-4 truncate">{user.name}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-5 relative">
                            <div
                                className="bg-primary h-5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(user.docs / maxDocs) * 100}%` }}
                            ></div>
                             <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{user.docs}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. Document Status Overview (NEW)
const documentStatusData = [
  { name: 'Completed', value: 1250 },
  { name: 'Processing', value: 210 },
  { name: 'Pending', value: 88 },
  { name: 'Error', value: 45 },
];
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']; // green, blue, yellow, red

const DocumentStatusChart: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Document Status</h2>
        <div className="flex-grow w-full h-64">
             <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={documentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                    >
                        {documentStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }}/>
                    <Legend iconType="circle" wrapperStyle={{fontSize: "14px"}}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
);


// 4. Weekly Activity Chart (NEW)
const weeklyActivityData = [
  { day: 'Mon', processed: 210 },
  { day: 'Tue', processed: 280 },
  { day: 'Wed', processed: 250 },
  { day: 'Thu', processed: 310 },
  { day: 'Fri', processed: 350 },
  { day: 'Sat', processed: 180 },
  { day: 'Sun', processed: 150 },
];

const WeeklyActivityChart: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Weekly Processing Activity</h2>
        <div className="w-full h-64">
            <ResponsiveContainer>
                <LineChart data={weeklyActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }}/>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} />
                    <Line type="monotone" dataKey="processed" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// 5. Top Performing Users Leaderboard
const topUsersData = [
    { name: 'John Smith', docs: 142 },
    { name: 'Sarah Johnson', docs: 98 },
    { name: 'Mike Davis', docs: 87 },
    { name: 'Lisa Wilson', docs: 76 },
    { name: 'David Brown', docs: 65 },
];

const TopUsers: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Top Performing Users</h2>
        <div className="space-y-3">
            {topUsersData.map((user, index) => (
                <div key={user.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                    <div className="flex items-center">
                        <span className="text-lg font-bold text-slate-400 w-8">{`#${index + 1}`}</span>
                        <img src={`https://i.pravatar.cc/40?u=${user.name.replace(' ', '')}`} alt={user.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                        <div>
                            <p className="font-semibold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">Documents processed</p>
                        </div>
                    </div>
                    <div className="text-right">
                         <p className="font-bold text-lg text-primary">{user.docs}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// 6. Quick Actions
interface ActionCardProps {
    title: string;
    description: string;
    icon: IconName;
    color: string;
}
const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, color }) => (
    <button className={`p-4 rounded-xl text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${color}`}>
        <Icon name={icon} className="w-7 h-7 text-white mb-3" />
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-xs text-white/80">{description}</p>
    </button>
);

const QuickActions: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm col-span-1 lg:col-span-2">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Admin Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <ActionCard title="Manage Documents" description="View all client documents" icon="document-text" color="bg-blue-500 hover:bg-blue-600" />
            <ActionCard title="User Management" description="Manage client accounts" icon="users" color="bg-indigo-500 hover:bg-indigo-600" />
            <ActionCard title="Client Settings" description="Configure client preferences" icon="preferences" color="bg-purple-500 hover:bg-purple-600" />
            <ActionCard title="System Analytics" description="Platform performance insights" icon="chart-bar" color="bg-pink-500 hover:bg-pink-600" />
        </div>
    </div>
);


// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Folders/Clients" value="24" icon="users" color="bg-blue-500" />
          <StatCard title="Emails Received" value="1,847" icon="inbox" color="bg-green-500" />
          <StatCard title="Pending Reviews" value="12" icon="clock" color="bg-yellow-500" />
          <StatCard title="Accuracy" value="94.5%" icon="target" color="bg-red-500" />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <UserProcessingChart />
        </div>
        <DocumentStatusChart />
        <div className="lg:col-span-2">
          <WeeklyActivityChart />
        </div>
        <TopUsers />
      </div>

      {/* Quick Actions Section */}
      <QuickActions />

    </div>
  );
};

export default Dashboard;