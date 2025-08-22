
import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, FolderStatus } from '../../types';
import Badge from '../ui/Badge';
import { Icon } from '../ui/Icon';

interface FolderCardProps {
  folder: Folder;
  openInviteModal: (folderId?: string) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, openInviteModal }) => {
  const getStatusColor = (status: FolderStatus): 'green' | 'gray' | 'yellow' => {
    switch (status) {
      case FolderStatus.Active:
        return 'green';
      case FolderStatus.Archived:
        return 'gray';
      case FolderStatus.PendingImport:
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const ActionButton: React.FC<{icon: any, label: string, onClick?: (e: React.MouseEvent) => void}> = ({icon, label, onClick}) => (
    <button 
      onClick={onClick}
      className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md"
    >
        <Icon name={icon} className="w-4 h-4 mr-2" />
        {label}
    </button>
  );
  
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault(); // Prevent navigation when an action button is clicked
    e.stopPropagation();
    action();
  };

  return (
    <Link to={`/dashboard/folders/${folder.id}`} className="block h-full">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <Icon name="folder" className="w-10 h-10 text-primary opacity-70" />
            <Badge color={getStatusColor(folder.status)}>{folder.status}</Badge>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-slate-800">{folder.folderName}</h3>
            <p className="text-sm text-slate-500">{folder.documentCount} documents</p>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-4 space-y-2">
            <ActionButton icon="user-plus" label="Invite Users" onClick={(e) => handleActionClick(e, () => openInviteModal(folder.id))} />
            <ActionButton icon="preferences" label="Preferences" onClick={(e) => handleActionClick(e, () => alert('Folder preferences coming soon!'))} />
            <ActionButton icon="import" label="Import Settings" onClick={(e) => handleActionClick(e, () => alert('Import settings coming soon!'))} />
          </div>
        </div>
    </Link>
  );
};

export default FolderCard;