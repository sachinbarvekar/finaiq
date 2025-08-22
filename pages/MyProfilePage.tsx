
import React from 'react';
import { Icon, IconName } from '../components/ui/Icon';
import Button from '../components/ui/Button';

// Mock admin data
const adminUser = {
  name: 'Sagar Agrobeet',
  email: 'sagar@agrobeet.com',
  role: 'Administrator',
  avatarUrl: 'https://picsum.photos/id/237/200/200',
  phone: '123-456-7890',
  team: 'Platform Operations',
  memberSince: '2022-08-22',
};

// Reusable components
const InfoCard: React.FC<{ title: string; icon?: IconName; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm ${className}`}>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            {icon && <Icon name={icon} className="w-5 h-5 mr-3 text-primary" />}
            {title}
        </h2>
        {children}
    </div>
);

const InfoItem: React.FC<{ label: string; value: string; icon: IconName }> = ({ label, value, icon }) => (
    <div className="flex items-start">
        <Icon name={icon} className="w-5 h-5 text-slate-400 mt-1 mr-4 flex-shrink-0" />
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="font-medium text-slate-800">{value}</p>
        </div>
    </div>
);

const SettingToggle: React.FC<{ label: string; description: string; enabled: boolean; }> = ({ label, description, enabled }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-medium text-slate-800">{label}</p>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${enabled ? 'bg-primary' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-6' : ''}`} />
        </div>
    </div>
);

// Main component
const MyProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <img
            src={adminUser.avatarUrl}
            alt="Admin Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-slate-200 mr-5"
          />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{adminUser.name}</h1>
            <p className="text-slate-500">{adminUser.role}</p>
          </div>
        </div>
        <Button variant="primary" leftIcon={<Icon name="edit" className="w-4 h-4" />}>
          Edit Profile
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <InfoCard title="About Me" icon="user-circle">
            <div className="space-y-4">
              <InfoItem label="Email Address" value={adminUser.email} icon="inbox" />
              <InfoItem label="Phone Number" value={adminUser.phone} icon="phone" />
              <InfoItem label="Team" value={adminUser.team} icon="users" />
              <InfoItem label="Member Since" value={new Date(adminUser.memberSince).toLocaleDateString()} icon="calendar"/>
            </div>
          </InfoCard>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Security" icon="settings">
            <div className="divide-y divide-slate-200">
                 <SettingToggle 
                    label="Two-Factor Authentication (2FA)"
                    description="Enhance your account security with 2FA."
                    enabled={true}
                />
                 <div className="py-3 flex items-center justify-between">
                    <div>
                         <p className="font-medium text-slate-800">Password</p>
                         <p className="text-sm text-slate-500">Last changed 3 months ago.</p>
                    </div>
                    <Button variant="outline" size="sm">Change Password</Button>
                 </div>
            </div>
          </InfoCard>

          <InfoCard title="Notifications" icon="bell">
             <div className="divide-y divide-slate-200">
                <SettingToggle 
                    label="Email Notifications"
                    description="Receive updates about your account via email."
                    enabled={true}
                />
                 <SettingToggle 
                    label="Weekly Reports"
                    description="Get a summary of platform activity."
                    enabled={true}
                />
                 <SettingToggle 
                    label="System Alerts"
                    description="Receive critical alerts about system status."
                    enabled={false}
                />
             </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
