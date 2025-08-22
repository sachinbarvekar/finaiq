import React, { useState, useEffect } from 'react';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../../types';
import { Icon, IconName } from '../ui/Icon';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import AiAssistant from './AiAssistant';

type DocumentFormData = Partial<Omit<Document, 'id' | 'folderId' | 'currency'>>;

interface DocumentViewSidebarProps {
  document: Document;
  onUpdate: (docId: string, data: DocumentFormData) => void;
  onDelete: () => void;
  onFieldHover: (fieldName: string | null) => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode; fieldName: string; onFieldHover: (fieldName: string | null) => void }> = ({ label, value, fieldName, onFieldHover }) => (
    <div 
        className="grid grid-cols-3 gap-4 items-center py-3 px-2 rounded-lg hover:bg-slate-50"
        onMouseEnter={() => onFieldHover(fieldName)}
        onMouseLeave={() => onFieldHover(null)}
    >
        <p className="text-sm text-slate-500 col-span-1">{label}</p>
        <div className="text-sm font-medium text-slate-800 text-right col-span-2">{value}</div>
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
        <div className="pt-1.5 pb-4">
            <p className="font-medium text-slate-800 text-sm">{title}</p>
            <p className="text-xs text-slate-500">{date}</p>
        </div>
    </div>
);

const DocumentViewSidebar: React.FC<DocumentViewSidebarProps> = ({ document, onUpdate, onDelete, onFieldHover }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'ai'>('details');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<DocumentFormData>({});
    
    useEffect(() => {
        setFormData({
            supplier: document.supplier,
            invoiceNumber: document.invoiceNumber,
            date: document.date,
            amount: document.amount,
            status: document.status,
            payment: document.payment,
            dueDate: document.dueDate,
        });
    }, [document]);

    const handleEditToggle = () => {
        if (isEditing) {
            // If was editing, reset form to original document state
            setFormData({
                supplier: document.supplier,
                invoiceNumber: document.invoiceNumber,
                date: document.date,
                amount: document.amount,
                status: document.status,
                payment: document.payment,
                dueDate: document.dueDate,
            });
        }
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        onUpdate(document.id, formData);
        setIsEditing(false);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const renderDetails = () => (
        <>
            <DetailItem label="Processing" value={<Badge status={document.status} />} fieldName="status" onFieldHover={onFieldHover} />
            <DetailItem label="Payment" value={<Badge status={document.payment} />} fieldName="payment" onFieldHover={onFieldHover} />
            <DetailItem label="Invoice Date" value={formatDate(document.date)} fieldName="date" onFieldHover={onFieldHover} />
            <DetailItem label="Due Date" value={formatDate(document.dueDate)} fieldName="dueDate" onFieldHover={onFieldHover} />
        </>
    );

    const renderEditForm = () => (
        <>
            <div className="py-2"><label className="text-sm text-slate-500">Processing</label><select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"><option>Ready</option><option>Review Required</option><option>Export Error</option></select></div>
            <div className="py-2"><label className="text-sm text-slate-500">Payment</label><select name="payment" value={formData.payment} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"><option>Paid</option><option>Pending</option><option>Overdue</option></select></div>
            <div className="py-2"><label className="text-sm text-slate-500">Invoice Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"/></div>
            <div className="py-2"><label className="text-sm text-slate-500">Due Date</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"/></div>
        </>
    );
    
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-slate-200">
                {isEditing ? (
                    <>
                        <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="w-full p-1 -ml-1 text-lg font-bold text-slate-800 rounded-md bg-slate-100 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary" />
                        <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="w-full mt-1 p-1 -ml-1 text-sm text-slate-500 font-mono rounded-md bg-slate-100 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary" />
                    </>
                ) : (
                    <>
                        <h2 className="font-bold text-slate-800 truncate text-lg" onMouseEnter={() => onFieldHover('supplier')} onMouseLeave={() => onFieldHover(null)}>{document.supplier}</h2>
                        <p className="text-sm text-slate-500 font-mono" onMouseEnter={() => onFieldHover('invoiceNumber')} onMouseLeave={() => onFieldHover(null)}>#{document.invoiceNumber}</p>
                    </>
                )}
            </div>
            
            <div className="p-2 border-b border-slate-200">
                <div className="flex items-center justify-center bg-slate-100 rounded-lg p-1">
                   <button onClick={() => setActiveTab('details')} className={`flex-1 text-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'details' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Details</button>
                   <button onClick={() => setActiveTab('activity')} className={`flex-1 text-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'activity' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Activity</button>
                   <button onClick={() => setActiveTab('ai')} className={`flex-1 text-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'ai' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>AI Assistant</button>
                </div>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'details' && (
                    <div className="space-y-1">
                        <div className="p-2 rounded-lg hover:bg-slate-100" onMouseEnter={() => onFieldHover('amount')} onMouseLeave={() => onFieldHover(null)}>
                             <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Total Amount</p>
                             {isEditing ? (
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-1 -ml-1 text-3xl font-bold text-slate-800 rounded-md bg-slate-100 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary" />
                             ) : (
                                <p className="text-3xl font-bold text-slate-800">{document.currency} {document.amount.toFixed(2)}</p>
                             )}
                        </div>
                        <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
                           {isEditing ? renderEditForm() : renderDetails()}
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
                {activeTab === 'ai' && (
                    <AiAssistant document={document} />
                )}
            </div>
            
            <div className="p-4 border-t border-slate-200 space-y-2">
                {isEditing ? (
                     <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleEditToggle} className="w-full">Cancel</Button>
                        <Button variant="primary" onClick={handleSave} className="w-full">Save Changes</Button>
                    </div>
                ) : (
                    <>
                        <Button variant="primary" leftIcon={<Icon name="edit" className="w-4 h-4" />} onClick={handleEditToggle} className="w-full">Edit Details</Button>
                        <Button variant="danger" leftIcon={<Icon name="trash" className="w-4 h-4"/>} onClick={onDelete} className="w-full">Delete Invoice</Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DocumentViewSidebar;