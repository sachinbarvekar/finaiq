import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { useDocuments } from '../contexts/DocumentContext';
import NotFound from './NotFound';
import Button from '../components/ui/Button';
import { Icon, IconName } from '../components/ui/Icon';
import DocumentTable from '../components/documents/DocumentTable';
import DocumentCard from '../components/documents/DocumentCard';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../types';
import Pagination from '../components/ui/Pagination';

const DOCUMENTS_PER_PAGE = 8;
type ViewMode = 'list' | 'grid';

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

const FolderViewPage: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const { getFolderById } = useClients();
  const { getDocumentsByFolderId, openImportModal, deleteDocument } = useDocuments();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const folder = folderId ? getFolderById(folderId) : undefined;
  
  if (!folder) {
    return <NotFound />;
  }

  const documents = getDocumentsByFolderId(folder.id);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
        const search = searchTerm.toLowerCase();
        return (
          doc.supplier.toLowerCase().includes(search) ||
          doc.invoiceNumber.toLowerCase().includes(search)
        );
      });
  }, [documents, searchTerm]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * DOCUMENTS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + DOCUMENTS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  const totalPages = Math.ceil(filteredDocuments.length / DOCUMENTS_PER_PAGE);
  
  // Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDocuments(filteredDocuments.map(d => d.id));
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
      selectedDocuments.forEach(docId => deleteDocument(docId));
      setSelectedDocuments([]);
    }
  }

  // Calculate stats for cards
  const totalDocuments = documents.length;
  const readyDocuments = documents.filter(doc => doc.status === DocumentProcessingStatus.Ready).length;
  const reviewDocuments = documents.filter(doc => doc.status === DocumentProcessingStatus.ReviewRequired).length;
  const errorDocuments = documents.filter(doc => doc.status === DocumentProcessingStatus.ExportError).length;

  return (
    <div>
       <div className="mb-6">
            <Link to="/dashboard/folders" className="text-sm text-primary hover:underline flex items-center">
                <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                Back to Folders
            </Link>
        </div>
       <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Folder: {folder.folderName}</h1>
        </div>
        
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
          <div className="relative flex-grow max-w-md">
             <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input
              type="text"
              placeholder="Search by supplier or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button leftIcon={<Icon name="upload" className="w-5 h-5"/>} onClick={() => folder && openImportModal(folder)}>
              Import Documents
            </Button>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
              {(['list', 'grid'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === mode ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  <Icon name={`view-${mode}` as 'view-list' | 'view-grid'} className="w-5 h-5"/>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedDocuments.length > 0 && (
          <div className="bg-primary/10 p-3 border-b border-slate-200 flex items-center justify-between">
            <p className="text-sm font-medium text-primary">{selectedDocuments.length} document(s) selected</p>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="!text-primary" onClick={() => alert('Reprocessing documents...')}>
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
        {viewMode === 'list' ? (
          <DocumentTable 
              documents={paginatedDocuments} 
              folderId={folder.id}
              selectedDocuments={selectedDocuments}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
          />
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedDocuments.map(doc => (
              <DocumentCard 
                key={doc.id} 
                document={doc}
                folderId={folder.id}
                isSelected={selectedDocuments.includes(doc.id)}
                onSelect={handleSelectOne}
              />
            ))}
          </div>
        )}

        {paginatedDocuments.length === 0 && (
           <div className="text-center p-8 text-slate-500">
              No documents found.
            </div>
        )}
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default FolderViewPage;