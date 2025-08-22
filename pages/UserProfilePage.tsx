import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';

// Mock user data for demonstration
const mockUsers: { [key: string]: { name: string; email: string; docs: number; avatar: string } } = {
    'U001': { name: 'John Smith', email: 'john.s@example.com', docs: 142, avatar: 'https://i.pravatar.cc/150?u=JohnSmith' },
    'U002': { name: 'Sarah Johnson', email: 'sarah.j@example.com', docs: 98, avatar: 'https://i.pravatar.cc/150?u=SarahJohnson' },
    'U003': { name: 'Mike Davis', email: 'mike.d@example.com', docs: 87, avatar: 'https://i.pravatar.cc/150?u=MikeDavis' },
    'U004': { name: 'Lisa Wilson', email: 'lisa.w@example.com', docs: 76, avatar: 'https://i.pravatar.cc/150?u=LisaWilson' },
    'U005': { name: 'David Brown', email: 'david.b@example.com', docs: 65, avatar: 'https://i.pravatar.cc/150?u=DavidBrown' },
    'U006': { name: 'Emma Taylor', email: 'emma.t@example.com', docs: 45, avatar: 'https://i.pravatar.cc/150?u=EmmaTaylor' },
};


const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const user = userId ? mockUsers[userId] : undefined;

    if (!user) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-slate-800">User Not Found</h2>
                <Link to="/dashboard" className="text-primary hover:underline mt-4 inline-block">Go back to Dashboard</Link>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
             <div className="mb-6">
                <Link to="/dashboard" className="text-sm text-primary hover:underline flex items-center">
                    <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                 <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 mx-auto -mt-20 mb-4"
                />
                <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                <p className="text-slate-500">{user.email}</p>
                 <div className="mt-6 border-t border-slate-200 pt-6">
                    <p className="text-4xl font-bold text-primary">{user.docs}</p>
                    <p className="text-slate-500">Total Documents Processed</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
