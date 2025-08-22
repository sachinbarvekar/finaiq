import React, { useState } from 'react';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../../types';
import { Icon, IconName } from '../ui/Icon';
import Badge from '../ui/Badge';

interface DocumentViewSidebarProps {
  document: Document;
  onDelete: () => void;
  onFieldHover: (fieldName: string | null) => void;
}

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; fieldName: string; onFieldHover: (fieldName: string | null) => void }> = ({ label, value, fieldName, onFieldHover }) => (
    <div 
        className="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-slate-100"
        onMouseEnter={() => onFieldHover(fieldName)}
        onMouseLeave={() => onFieldHover(null)}
    >
        <p className="text-sm text-slate-500">{label}</p>
        <div className="text-sm font-medium text-slate-800 text-right">{value}</div>
    </div>
);

const TimelineEvent: React.FC<{ title: string; date: string; icon: IconName; isLast?: boolean }> = ({ title, date, icon, isLast = false }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-4">
            <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full">
                <Icon name={icon} className="w-4 h-4 text-slate-500" />
            </div>
            {!isLast && <div className="w-px h-full bg-slate-200" />}
        </div>
        <div className="pt-1.5">
            <p className="font-medium text-slate-800 text-sm">{title}</p>
            <p className="text-xs text-slate-500">{date}</p>
        </div>
    </div>
);

const DocumentViewSidebar: React.FC<DocumentViewSidebarProps> = ({ document, onDelete, onFieldHover }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const getProcessingStatusColor = (status: DocumentProcessingStatus) => status === 'Ready' ? 'green' : status === 'Export Error' ? 'red' : 'yellow';
    const getPaymentStatusColor = (status: PaymentStatus) => status === 'Paid' ? 'green' : status === 'Overdue' ? 'red' : 'yellow';
    
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200">
                <h2 
                    className="font-bold text-slate-800 truncate"
                    onMouseEnter={() => onFieldHover('supplier')}
                    onMouseLeave={() => onFieldHover(null)}
                >
                    Invoice from {document.supplier}
                </h2>
                <p 
                    className="text-sm text-slate-500 font-mono"
                    onMouseEnter={() => onFieldHover('invoiceNumber')}
                    onMouseLeave={() => onFieldHover(null)}
                >
                    #{document.invoiceNumber}
                </p>
            </div>
            
            <div className="p-2 border-b border-slate-200">
                <div className="flex items-center justify-center bg-slate-100 rounded-lg p-1">
                   <button onClick={() => setActiveTab('details')} className={`flex-1 text-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'details' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Details</button>
                   <button onClick={() => setActiveTab('activity')} className={`flex-1 text-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'activity' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Activity</button>
                </div>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'details' && (
                    <div className="space-y-2">
                        <div 
                             className="p-2 rounded-lg hover:bg-slate-100"
                             onMouseEnter={() => onFieldHover('amount')}
                             onMouseLeave={() => onFieldHover(null)}
                        >
                             <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Total Amount</p>
                             <p className="text-3xl font-bold text-slate-800">{document.currency} {document.amount.toFixed(2)}</p>
                        </div>
                        <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
                            <DetailItem label="Processing Status" value={<Badge color={getProcessingStatusColor(document.status)}>{document.status}</Badge>} fieldName="status" onFieldHover={onFieldHover} />
                            <DetailItem label="Payment Status" value={<Badge color={getPaymentStatusColor(document.payment)}>{document.payment}</Badge>} fieldName="payment" onFieldHover={onFieldHover} />
                            <DetailItem label="Invoice Date" value={formatDate(document.date)} fieldName="date" onFieldHover={onFieldHover} />
                            <DetailItem label="Due Date" value={formatDate(document.dueDate)} fieldName="dueDate" onFieldHover={onFieldHover} />
                        </div>
                    </div>
                )}
                {activeTab === 'activity' && (
                     <div className="space-y-1">
                        <TimelineEvent title="Marked as Ready" date="2 days ago" icon="check-circle" />
                        <TimelineEvent title="Processing Complete" date="2 days ago" icon="workflow" />
                        <TimelineEvent title="Document Uploaded" date="3 days ago" icon="upload" isLast />
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t border-slate-200 space-y-2">
                <button
                    onClick={() => alert('Reprocessing!')}
                    className="w-full flex items-center justify-center p-3 text-sm font-medium rounded-lg transition-colors text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                    <Icon name="reprocess" className="w-5 h-5 mr-2"/>
                    Reprocess
                </button>
                <button
                    onClick={onDelete}
                    className="w-full flex items-center justify-center p-3 text-sm font-medium rounded-lg transition-colors text-red-600 bg-red-50 hover:bg-red-100"
                >
                    <Icon name="trash" className="w-5 h-5 mr-2"/>
                    Delete Invoice
                </button>
            </div>
        </div>
    );
};

export default DocumentViewSidebar;
