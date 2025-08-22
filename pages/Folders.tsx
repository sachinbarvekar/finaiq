import React from 'react';
import FolderCard from '../components/folders/FolderCard';
import { useClients } from '../contexts/ClientContext';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

const Folders: React.FC = () => {
  const { folders, openInviteModal } = useClients();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Folder Management</h1>
        <Button onClick={openInviteModal} leftIcon={<Icon name="user-plus" className="w-5 h-5"/>}>
          Invite users
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  );
};

export default Folders;