
import React from 'react';
import FolderCard from '../components/folders/FolderCard';
import { useClients } from '../contexts/ClientContext';

const Folders: React.FC = () => {
  const { folders } = useClients();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Folder Management</h1>
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
