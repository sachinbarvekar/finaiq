import React from 'react';
import { ClientStatus, DocumentProcessingStatus, FolderStatus, PaymentStatus } from '../../types';

type Status = ClientStatus | DocumentProcessingStatus | FolderStatus | PaymentStatus;

interface BadgeProps {
  status: Status;
}

interface StatusConfig {
  label: string;
  color: string;
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  // By using Record<string, StatusConfig> we can handle cases where different enums
  // share the same string value (e.g., ClientStatus.Active and FolderStatus.Active are both 'Active').
  // This avoids TypeScript errors about missing keys when using a stricter Record<Status, ...> type.
  const statusConfig: Record<string, StatusConfig> = {
    // Document Processing
    [DocumentProcessingStatus.Ready]: { label: 'Ready', color: 'bg-green-100 text-green-800' },
    [DocumentProcessingStatus.ExportError]: { label: 'Export Error', color: 'bg-red-100 text-red-800' },
    [DocumentProcessingStatus.ReviewRequired]: { label: 'Review Required', color: 'bg-yellow-100 text-yellow-800' },
    [DocumentProcessingStatus.Processing]: { label: 'Processing', color: 'bg-blue-100 text-blue-800', pulse: true },
    // Payment
    [PaymentStatus.Paid]: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    [PaymentStatus.Pending]: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    [PaymentStatus.Overdue]: { label: 'Overdue', color: 'bg-red-100 text-red-800' },
    // Client & Folder Statuses (FolderStatus.Active is covered by ClientStatus.Active)
    [ClientStatus.Active]: { label: 'Active', color: 'bg-green-100 text-green-800' },
    [ClientStatus.Inactive]: { label: 'Inactive', color: 'bg-slate-200 text-slate-700' },
    [FolderStatus.Archived]: { label: 'Archived', color: 'bg-slate-200 text-slate-700' },
    [FolderStatus.PendingImport]: { label: 'Pending Import', color: 'bg-yellow-100 text-yellow-800' },
  };

  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.pulse && <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-current opacity-75 mr-2"></span>}
      {config.label}
    </span>
  );
};

export default Badge;
