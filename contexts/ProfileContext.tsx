import React, { createContext, useState, useContext, ReactNode } from 'react';
import EditProfileModal from '../components/profile/EditProfileModal';

// Mock initial admin data
const MOCK_ADMIN = {
  name: 'Sagar Agrobeet',
  email: 'sagar@agrobeet.com',
  role: 'Administrator',
  avatarUrl: 'https://picsum.photos/id/237/200/200',
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
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser>(MOCK_ADMIN);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const updateAdminProfile = (data: EditableAdminData) => {
    setAdminUser(prev => ({ ...prev, ...data }));
  };
  
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleSubmit = (data: EditableAdminData) => {
    updateAdminProfile(data);
    closeEditModal();
  };

  const value = {
    adminUser,
    updateAdminProfile,
    openEditModal,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSubmit}
        currentUser={adminUser}
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
