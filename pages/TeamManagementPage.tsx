
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { UserRole } from '../types';

type UserStatus = 'Active' | 'Invited' | 'Deactivated';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl: string;
}

const mockTeam: TeamMember[] = [
    { id: 'SA001', name: 'Super Admin', email: 'superadmin@finaiq.com', role: 'SuperAdmin', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop' },
    { id: 'A001', name: 'Sagar Agrobeet', email: 'admin@finaiq.com', role: 'Admin', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' },
    { id: 'A002', name: 'Jane Smith', email: 'admin2@finaiq.com', role: 'Admin', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { id: 'A003', name: 'Robert Brown', email: 'robert.b@finaiq.com', role: 'Admin', status: 'Invited', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
];

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
    const config = {
        Active: 'bg-green-100 text-green-800',
        Invited: 'bg-blue-100 text-blue-800',
        Deactivated: 'bg-slate-200 text-slate-700'
    };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[status]}`}>{status}</span>;
}

const TeamManagementPage: React.FC = () => {
    const navigate = useNavigate();
    
    // SuperAdmins manage Admins
    const admins = mockTeam.filter(m => m.role === 'Admin' || m.role === 'SuperAdmin');

    const handleRowClick = (member: TeamMember) => {
        if (member.role === 'Admin') {
            navigate(`/dashboard/team/${member.id}`);
        } else {
            // SuperAdmin can go to their own profile
            navigate('/dashboard/profile');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Admins</h1>
                <Button leftIcon={<Icon name="user-plus" className="w-5 h-5"/>}>
                    Invite Admin
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">Name</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Email</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Role</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(member => (
                            <tr 
                                key={member.id} 
                                className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer"
                                onClick={() => handleRowClick(member)}
                            >
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full object-cover mr-3" />
                                        <span className="font-medium text-slate-800">{member.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">{member.email}</td>
                                <td className="p-4 text-sm text-slate-600">{member.role}</td>
                                <td className="p-4"><StatusBadge status={member.status} /></td>
                                <td className="p-4 text-right">
                                    <button 
                                        className="p-2 text-slate-500 hover:text-primary rounded-full hover:bg-slate-100 transition-colors"
                                        onClick={(e) => { e.stopPropagation(); alert(`Actions for ${member.name}`); }}
                                    >
                                        <Icon name="dots-vertical" className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamManagementPage;