
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import EditProfileModal from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import { useAuth } from './AuthContext';
import { User } from '../types';

export type ProfileUser = User;
export type EditableProfileData = Pick<ProfileUser, 'name' | 'phone' | 'team'>;

interface ProfileContextType {
  currentUser: ProfileUser | null;
  updateCurrentUser: (data: EditableProfileData) => void;
  openEditModal: () => void;
  openChangePasswordModal: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Get authenticated user
  const [currentUser, setCurrentUser] = useState<ProfileUser | null>(user);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const updateCurrentUser = (data: EditableProfileData) => {
    setCurrentUser(prev => (prev ? { ...prev, ...data } : null));
    // In a real app, you would also update the user object in AuthContext and call an API.
  };
  
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  const handleProfileSubmit = (data: EditableProfileData) => {
    updateCurrentUser(data);
    closeEditModal();
  };

  const handleChangePasswordSubmit = () => {
    alert('Password changed successfully!');
    closeChangePasswordModal();
  }

  if (!currentUser) {
    // This can be a loading spinner in a real app
    // For now, it prevents downstream components from crashing if the user is not loaded.
    return <>{children}</>;
  }

  const value = {
    currentUser,
    updateCurrentUser,
    openEditModal,
    openChangePasswordModal,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
      {currentUser && (
        <>
            <EditProfileModal 
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleProfileSubmit}
                currentUser={currentUser}
            />
            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={closeChangePasswordModal}
                onSubmit={handleChangePasswordSubmit}
            />
        </>
      )}
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
