
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Folder, FolderStatus } from '../../types';
import { Icon } from '../ui/Icon';

interface FolderPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
  onUpdateFolder: (folderId: string, data: Partial<Omit<Folder, 'id'>>) => void;
}

const SettingToggle: React.FC<{ label: string; description: string; enabled: boolean; onToggle: () => void; }> = ({ label, description, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-medium text-slate-800">{label}</p>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <button
            onClick={onToggle}
            className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${enabled ? 'bg-primary' : 'bg-slate-300'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-6' : ''}`} />
        </button>
    </div>
);


const FolderPreferencesModal: React.FC<FolderPreferencesModalProps> = ({ isOpen, onClose, folder, onUpdateFolder }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!folder) return null;

  const isArchived = folder.status === FolderStatus.Archived;

  const handleArchiveToggle = () => {
    const newStatus = isArchived ? FolderStatus.Active : FolderStatus.Archived;
    onUpdateFolder(folder.id, { status: newStatus });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Preferences for ${folder.folderName}`}>
      <div className="space-y-6">
        <div>
            <h3 className="text-md font-semibold text-slate-700 mb-2">General</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
                <SettingToggle 
                    label="Email Notifications"
                    description="Receive email for new documents."
                    enabled={notificationsEnabled}
                    onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
                />
            </div>
        </div>
        
        <div>
            <h3 className="text-md font-semibold text-slate-700 mb-2">Folder Status</h3>
            <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <p className="font-medium text-slate-800">{isArchived ? 'Restore Folder' : 'Archive Folder'}</p>
                    <p className="text-sm text-slate-500">{isArchived ? 'This folder will become active again.' : 'Hide this folder from the main view.'}</p>
                </div>
                <Button variant={isArchived ? "secondary" : "outline"} onClick={handleArchiveToggle}>
                    {isArchived ? 'Restore' : 'Archive'}
                </Button>
            </div>
        </div>
        
        <div className="border-t border-red-200 pt-4">
             <h3 className="text-md font-semibold text-red-600 mb-2 flex items-center">
                <Icon name="exclamation-circle" className="w-5 h-5 mr-2" />
                Danger Zone
             </h3>
             <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <p className="font-medium text-red-800">Delete Client & Folder</p>
                    <p className="text-sm text-red-600">This action is irreversible. Visit the client page to delete.</p>
                </div>
             </div>
        </div>
        <div className="flex justify-end pt-2">
            <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default FolderPreferencesModal;
