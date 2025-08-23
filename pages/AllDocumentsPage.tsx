
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocuments } from '../contexts/DocumentContext';
import { useClients } from '../contexts/ClientContext';
import { Document, DocumentProcessingStatus } from '../types';
import AllDocumentsTable from '../components/documents/AllDocumentsTable';
import Pagination from '../components/ui/Pagination';
import { Icon, IconName } from '../components/ui/Icon';
import DocumentCard from '../components/documents/DocumentCard';
import DocumentBoard from '../components/documents/DocumentBoard';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const DOCUMENTS_PER_PAGE = 12; // Adjusted for grid view
type ViewMode = 'list' | 'grid' | 'board';

const StatCard: React.FC<{ title: string; value: number | string; icon: IconName; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon name={icon} className="w-5 h-5 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const AllDocumentsPage: React.FC = () => {
    const { documents, openEditModal, openDeleteModal, reprocessDocuments, updateDocument } = useDocuments();
    const { clients, folders } = useClients();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<DocumentProcessingStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

    useEffect(() => {
        const initialStatus = searchParams.get('status');
        if (initialStatus && Object.values(DocumentProcessingStatus).includes(initialStatus as DocumentProcessingStatus)) {
            setStatusFilter(initialStatus as DocumentProcessingStatus);
        } else if (initialStatus === 'all') {
            setStatusFilter('all');
        }
    }, [searchParams]);
    
    useEffect(() => {
      setSelectedDocuments([]);
    }, [currentPage, viewMode, statusFilter, searchTerm]);
    
    const adminDocuments = useMemo(() => {
        const adminClientIds = clients.filter(c => c.adminId === user?.id).map(c => c.id);
        const adminFolderIds = folders.filter(f => adminClientIds.includes(f.clientId)).map(f => f.id);
        return documents.filter(doc => adminFolderIds.includes(doc.folderId));
    }, [documents, folders, clients, user]);

    const documentsWithClient = useMemo(() => {
        return adminDocuments.map(doc => {
            const folder = folders.find(f => f.id === doc.folderId);
            const client = folder ? clients.find(c => c.id === folder.clientId) : undefined;
            return {
                ...doc,
                clientName: client ? client.companyName : 'Unknown Client'
            };
        });
    }, [adminDocuments, clients, folders]);

    const filteredDocuments = useMemo(() => {
        return documentsWithClient
            .filter(doc => {
                if (statusFilter === 'all') return true;
                return doc.status === statusFilter;
            })
            .filter(doc => {
                const search = searchTerm.toLowerCase();
                return (
                    doc.supplier.toLowerCase().includes(search) ||
                    doc.invoiceNumber.toLowerCase().includes(search) ||
                    doc.clientName.toLowerCase().includes(search)
                );
            });
    }, [documentsWithClient, searchTerm, statusFilter]);

    const paginatedDocuments = useMemo(() => {
        const startIndex = (currentPage - 1) * DOCUMENTS_PER_PAGE;
        return filteredDocuments.slice(startIndex, startIndex + DOCUMENTS_PER_PAGE);
    }, [filteredDocuments, currentPage]);

    const totalPages = Math.ceil(filteredDocuments.length / DOCUMENTS_PER_PAGE);

    // Handlers
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedDocuments(paginatedDocuments.map(d => d.id));
        } else {
            setSelectedDocuments([]);
        }
    };

    const handleSelectOne = (docId: string) => {
        setSelectedDocuments(prev => 
            prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
        );
    };

    const handleBulkDelete = () => {
        if(window.confirm(`Are you sure you want to delete ${selectedDocuments.length} documents?`)){
            selectedDocuments.forEach(docId => openDeleteModal(docId));
            setSelectedDocuments([]);
        }
    };

    const handleBulkReprocess = () => {
        reprocessDocuments(selectedDocuments);
        setSelectedDocuments([]);
    };

    const handleDocumentDrop = (docId: string, newStatus: DocumentProcessingStatus) => {
        updateDocument(docId, { status: newStatus });
    };
    
    // Calculate stats for cards
    const totalDocuments = adminDocuments.length;
    const readyDocuments = adminDocuments.filter(doc => doc.status === DocumentProcessingStatus.Ready).length;
    const reviewDocuments = adminDocuments.filter(doc => doc.status === DocumentProcessingStatus.ReviewRequired).length;
    const errorDocuments = adminDocuments.filter(doc => doc.status === DocumentProcessingStatus.ExportError).length;

    const renderContent = () => {
        switch(viewMode) {
          case 'list':
            return (
              <AllDocumentsTable 
                  documents={paginatedDocuments}
                  selectedDocuments={selectedDocuments}
                  onSelectAll={handleSelectAll}
                  onSelectOne={handleSelectOne}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
              />
            );
          case 'grid':
            return (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedDocuments.map(doc => (
                  <DocumentCard 
                    key={doc.id} 
                    document={doc}
                    folderId={doc.folderId}
                    clientName={doc.clientName} // Pass client name
                    isSelected={selectedDocuments.includes(doc.id)}
                    onSelect={handleSelectOne}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onReprocess={reprocessDocuments}
                  />
                ))}
              </div>
            );
          case 'board':
            return <DocumentBoard documents={filteredDocuments} onDocumentDrop={handleDocumentDrop} />
        }
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">All Documents</h1>
            
             {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Documents" value={totalDocuments} icon="document-text" color="bg-blue-500" />
                <StatCard title="Ready" value={readyDocuments} icon="check-circle" color="bg-green-500" />
                <StatCard title="Review Required" value={reviewDocuments} icon="exclamation-circle" color="bg-yellow-500" />
                <StatCard title="Export Errors" value={errorDocuments} icon="x-circle" color="bg-red-500" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header with Search and View Toggles */}
                <div className="flex flex-wrap justify-between items-center gap-4 p-4 border-b border-slate-200">
                    <div className="flex items-center gap-4 flex-grow">
                        <div className="relative flex-grow max-w-sm">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by supplier, invoice #, or client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as DocumentProcessingStatus | 'all')}
                                className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">All Statuses</option>
                                {Object.values(DocumentProcessingStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                        {(['list', 'grid', 'board'] as ViewMode[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${viewMode === mode ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                <Icon name={mode === 'board' ? 'view-boards' : `view-${mode}` as IconName} className="w-5 h-5"/>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedDocuments.length > 0 && viewMode !== 'board' && (
                    <div className="bg-primary/10 p-3 border-b border-slate-200 flex items-center justify-between">
                        <p className="text-sm font-medium text-primary">{selectedDocuments.length} document(s) selected</p>
                        <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" className="!text-primary" onClick={handleBulkReprocess}>
                            <Icon name="reprocess" className="w-4 h-4 mr-2"/> Reprocess
                        </Button>
                        <Button size="sm" variant="ghost" className="!text-primary" onClick={() => alert('Downloading documents...')}>
                            <Icon name="download" className="w-4 h-4 mr-2"/> Download
                        </Button>
                        <Button size="sm" variant="ghost" className="!text-red-600" onClick={handleBulkDelete}>
                            <Icon name="trash" className="w-4 h-4 mr-2"/> Delete
                        </Button>
                        </div>
                    </div>
                )}
                
                {/* Content Area */}
                {renderContent()}

                {(viewMode !== 'board' && paginatedDocuments.length === 0) && (
                    <div className="text-center p-8 text-slate-500">
                        No documents found.
                    </div>
                )}
                
                {viewMode !== 'board' && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};

export default AllDocumentsPage;