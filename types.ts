
export enum ClientStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: ClientStatus;
  address?: string;
  notes?: string;
  // New fields for profile page
  accountCreated: string;
  lastActivity: string;
  monthlyGrowth: number;
  folderId: string;
  integration: string;
  approvedDocs: number;
  pendingDocs: number;
  rejectedDocs: number;
}

export enum FolderStatus {
  Active = 'Active',
  Archived = 'Archived',
  PendingImport = 'Pending Import',
}

export interface Folder {
  id: string;
  folderName: string; // Same as Client ID
  documentCount: number;
  status: FolderStatus;
  clientId: string;
}

export enum DocumentProcessingStatus {
  Ready = 'Ready',
  ExportError = 'Export Error',
  ReviewRequired = 'Review Required',
  Processing = 'Processing',
}

export enum PaymentStatus {
    Paid = 'Paid',
    Pending = 'Pending',
    Overdue = 'Overdue',
}


export interface Document {
    id: string;
    folderId: string;
    supplier: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    currency: 'USD';
    status: DocumentProcessingStatus;
    payment: PaymentStatus;
    dueDate: string;
}