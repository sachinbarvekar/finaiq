import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDocuments } from '../contexts/DocumentContext';
import NotFound from './NotFound';
import { Icon, IconName } from '../components/ui/Icon';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../types';

// --- Reusable Sub-components for this page ---

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="text-sm font-medium text-slate-800 text-right">{value}</div>
    </div>
);

const TimelineEvent: React.FC<{ title: string; date: string; icon: IconName; isLast?: boolean }> = ({ title, date, icon, isLast = false }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-4">
            <div>
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full">
                    <Icon name={icon} className="w-4 h-4 text-slate-500" />
                </div>
            </div>
            {!isLast && <div className="w-px h-full bg-slate-200" />}
        </div>
        <div className="pt-1">
            <p className="font-medium text-slate-800 text-sm">{title}</p>
            <p className="text-xs text-slate-500">{date}</p>
        </div>
    </div>
);

const FakeDocument: React.FC<{ doc: Document }> = ({ doc }) => (
    <div className="w-full max-w-4xl bg-white shadow-lg p-8 sm:p-12 rounded-lg border border-slate-200 mx-auto">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{doc.supplier}</h1>
                <p className="text-slate-500">123 Business Rd, Suite 100</p>
                <p className="text-slate-500">Business City, 12345</p>
            </div>
            <h2 className="text-3xl font-light text-slate-500 tracking-wider">INVOICE</h2>
        </div>
        <div className="flex justify-between mb-8">
            <div>
                <p className="text-slate-500 text-sm">Billed To</p>
                <p className="font-medium text-slate-800">Innovate Inc.</p>
                <p className="text-slate-600">John Doe</p>
            </div>
            <div className="text-right">
                <p><span className="text-slate-500 text-sm">Invoice #: </span><span className="font-medium text-slate-800">{doc.invoiceNumber}</span></p>
                <p><span className="text-slate-500 text-sm">Date: </span><span className="font-medium text-slate-800">{new Date(doc.date).toLocaleDateString()}</span></p>
            </div>
        </div>
        <div className="space-y-3 mb-8">
            <div className="h-3 w-full bg-slate-200 rounded-full"></div>
            <div className="h-3 w-5/6 bg-slate-200 rounded-full"></div>
            <div className="h-3 w-full bg-slate-200 rounded-full"></div>
            <div className="h-3 w-3/4 bg-slate-200 rounded-full"></div>
            <div className="h-3 w-5/6 bg-slate-200 rounded-full"></div>
        </div>
        <div className="flex justify-end">
            <div className="w-full sm:w-1/2">
                <div className="flex justify-between text-slate-600"><span>Subtotal:</span> <span>{doc.amount.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-600"><span>Tax (0%):</span> <span>0.00</span></div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-bold text-slate-800 text-lg"><span>Total:</span> <span>${doc.amount.toFixed(2)}</span></div>
            </div>
        </div>
    </div>
);


const SidebarContent: React.FC<{ document: Document; onDelete: () => void }> = ({ document, onDelete }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'actions'>('details');

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const getProcessingStatusColor = (status: DocumentProcessingStatus) => status === 'Ready' ? 'green' : status === 'Export Error' ? 'red' : 'yellow';
    const getPaymentStatusColor = (status: PaymentStatus) => status === 'Paid' ? 'green' : status === 'Overdue' ? 'red' : 'yellow';
    
    const TabButton: React.FC<{ name: 'details' | 'activity' | 'actions'; children: React.ReactNode }> = ({ name, children }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === name ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
            {children}
        </button>
    );

    const ActionButton: React.FC<{label: string, icon: IconName, onClick?: () => void, variant?: 'default' | 'danger'}> = ({label, icon, onClick, variant='default'}) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${
                variant === 'danger'
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
            }`}
        >
            <Icon name={icon} className="w-5 h-5 mr-3"/>
            {label}
        </button>
    )

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200">
                <h2 className="font-bold text-slate-800">Invoice from {document.supplier}</h2>
                <p className="text-sm text-slate-500 font-mono">#{document.invoiceNumber}</p>
            </div>
            
            <div className="p-2 border-b border-slate-200">
                <div className="flex items-center justify-center bg-slate-100 rounded-lg p-1">
                   <TabButton name="details">Details</TabButton>
                   <TabButton name="activity">Activity</TabButton>
                   <TabButton name="actions">Actions</TabButton>
                </div>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'details' && (
                    <div className="space-y-4">
                        <div>
                             <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Total Amount</p>
                             <p className="text-2xl font-bold text-slate-800">{document.currency} {document.amount.toFixed(2)}</p>
                        </div>
                        <div className="divide-y divide-slate-200">
                            <DetailItem label="Processing Status" value={<Badge color={getProcessingStatusColor(document.status)}>{document.status}</Badge>} />
                            <DetailItem label="Payment Status" value={<Badge color={getPaymentStatusColor(document.payment)}>{document.payment}</Badge>} />
                            <DetailItem label="Invoice Date" value={formatDate(document.date)} />
                            <DetailItem label="Due Date" value={formatDate(document.dueDate)} />
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
                {activeTab === 'actions' && (
                    <div className="space-y-3">
                        <ActionButton label="Reprocess Invoice" icon="reprocess" onClick={() => alert('Reprocessing!')} />
                        <ActionButton label="Delete Invoice" icon="trash" onClick={onDelete} variant="danger"/>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Page Component ---

const DocumentViewPage: React.FC = () => {
    const { folderId, documentId } = useParams<{ folderId: string, documentId: string }>();
    const { getDocumentById, openDeleteModal, openEditModal } = useDocuments();
    const navigate = useNavigate();
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const document = documentId ? getDocumentById(documentId) : undefined;

    if (!document || document.folderId !== folderId) {
        return <NotFound />;
    }

    const handleDelete = () => {
        openDeleteModal(document.id);
        navigate(`/folders/${folderId}`);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* --- Header --- */}
            <header className="flex items-center justify-between p-3 border-b border-slate-200 flex-shrink-0">
                <div>
                    <Link to={`/folders/${folderId}`} className="text-sm text-primary hover:underline flex items-center">
                        <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                        <span>Back to Documents</span>
                    </Link>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="secondary" leftIcon={<Icon name="download" className="w-4 h-4" />}>Download</Button>
                    <Button variant="primary" leftIcon={<Icon name="edit" className="w-4 h-4" />} onClick={() => openEditModal(document.id)}>Edit</Button>
                     <button
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors"
                        aria-label={isPanelOpen ? "Hide details panel" : "Show details panel"}
                     >
                        <Icon name={isPanelOpen ? 'chevrons-right' : 'chevrons-left'} className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* --- Main Content --- */}
            <div className="flex flex-1 min-h-0">
                {/* --- Document Preview --- */}
                <main className="flex-1 bg-slate-50 overflow-auto p-4 md:p-8">
                    <FakeDocument doc={document} />
                </main>

                {/* --- Details Sidebar --- */}
                <aside className={`transition-all duration-300 ease-in-out flex-shrink-0 bg-white border-l border-slate-200 ${isPanelOpen ? 'w-80' : 'w-0'}`}>
                   {isPanelOpen && <SidebarContent document={document} onDelete={handleDelete} />}
                </aside>
            </div>
        </div>
    );
};

export default DocumentViewPage;