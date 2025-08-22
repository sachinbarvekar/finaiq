
import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Folder } from '../../types';
import { Icon } from '../ui/Icon';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  initialFolderId?: string;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, folders, initialFolderId }) => {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState('Administrator');
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setEmails('');
      setRole('Administrator');
      setSelectedFolders(initialFolderId ? [initialFolderId] : []);
    }
  }, [isOpen, initialFolderId]);

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolders(prev =>
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFolders.length === folders.length) {
      setSelectedFolders([]);
    } else {
      setSelectedFolders(folders.map(f => f.id));
    }
  };

  const handleSubmit = () => {
    if (emails && selectedFolders.length > 0) {
      alert(`Inviting users with emails: ${emails} to folders: ${selectedFolders.join(', ')} with role: ${role}`);
      onClose();
    } else {
      alert('Please enter at least one email and select at least one folder.');
    }
  };
  
  const isAllSelected = useMemo(() => folders.length > 0 && selectedFolders.length === folders.length, [folders, selectedFolders]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Folder Users">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Invite users to folders</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label htmlFor="emails" className="flex items-center text-sm font-medium text-slate-700 mb-1">
              Emails <Icon name="information-circle" className="w-4 h-4 ml-1 text-slate-400" />
            </label>
            <textarea
              id="emails"
              rows={3}
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter emails separated by comma"
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option>Administrator</option>
              <option>Member</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {isAllSelected ? 'Deselect all folders' : 'Select all folders'}
          </Button>
        </div>
        
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Folders</p>
          <div className="max-h-40 overflow-y-auto space-y-1 grid grid-cols-1 md:grid-cols-2 gap-x-4 pr-2">
            {folders.map(folder => (
              <label key={folder.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedFolders.includes(folder.id)}
                  onChange={() => handleFolderSelect(folder.id)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-800">{folder.folderName}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t border-slate-200">
          <Button onClick={handleSubmit}>Invite user</Button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteUserModal;