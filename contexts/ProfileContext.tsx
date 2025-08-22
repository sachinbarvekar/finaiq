
import React, { createContext, useState, useContext, ReactNode } from 'react';
import EditProfileModal from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

// Mock initial admin data
const MOCK_ADMIN = {
  name: 'Sagar Agrobeet',
  email: 'sagar@agrobeet.com',
  role: 'Administrator',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  phone: '123-456-7890',
  team: 'Platform Operations',
  memberSince: '2022-08-22',
};

type AdminUser = typeof MOCK_ADMIN;
export type EditableAdminData = Pick<AdminUser, 'name' | 'phone' | 'team'>;

interface ProfileContextType {
  adminUser: AdminUser;
  updateAdminProfile: (data: EditableAdminData) => void;
  openEditModal: () => void;
  openChangePasswordModal: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser>(MOCK_ADMIN);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const updateAdminProfile = (data: EditableAdminData) => {
    setAdminUser(prev => ({ ...prev, ...data }));
  };
  
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  const handleProfileSubmit = (data: EditableAdminData) => {
    updateAdminProfile(data);
    closeEditModal();
  };

  const handleChangePasswordSubmit = () => {
    alert('Password changed successfully!');
    closeChangePasswordModal();
  }

  const value = {
    adminUser,
    updateAdminProfile,
    openEditModal,
    openChangePasswordModal,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleProfileSubmit}
        currentUser={adminUser}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={closeChangePasswordModal}
        onSubmit={handleChangePasswordSubmit}
      />
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};