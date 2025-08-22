import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { useDocuments } from '../contexts/DocumentContext';
import NotFound from './NotFound';
import Button from '../components/ui/Button';
import { Icon, IconName } from '../components/ui/Icon';
import DocumentTable from '../components/documents/DocumentTable';
import { Document, DocumentProcessingStatus, PaymentStatus } from '../types';
import Pagination from '../components/ui/Pagination';

const DOCUMENTS_PER_PAGE = 5;

const StatCard: React.FC<{ title: string; value: number; icon: IconName; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const FolderViewPage: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const { getFolderById } = useClients();
  const { getDocumentsByFolderId, openAddModal, openDeleteModal } = useDocuments();

  const [searchTerm, setSearchTerm] = useState('');
  const [processingFilter, setProcessingFilter] = useState<DocumentProcessingStatus | 'All'>('All');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const folder = folderId ? getFolderById(folderId) : undefined;
  
  if (!folder) {
    return <NotFound />;
  }

  const documents = getDocumentsByFolderId(folder.id);

  const filteredDocuments = useMemo(() => {
    return documents
      .filter(doc => processingFilter === 'All' || doc.status === processingFilter)
      .filter(doc => paymentFilter === 'All' || doc.payment === paymentFilter)
      .filter(doc => {
        const search = searchTerm.toLowerCase();
        return (
          doc.supplier.toLowerCase().includes(search) ||
          doc.invoiceNumber.toLowerCase().includes(search)
        );
      });
  }, [documents, searchTerm, processingFilter, paymentFilter]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * DOCUMENTS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + DOCUMENTS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  const totalPages = Math.ceil(filteredDocuments.length / DOCUMENTS_PER_PAGE);
  
  const totalDocs = filteredDocuments.length;
  const readyDocs = filteredDocuments.filter(d => d.status === DocumentProcessingStatus.Ready).length;
  const errorDocs = filteredDocuments.filter(d => d.status === DocumentProcessingStatus.ExportError).length;
  const reviewDocs = filteredDocuments.filter(d => d.status === DocumentProcessingStatus.ReviewRequired).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleProcessingFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProcessingFilter(e.target.value as DocumentProcessingStatus | 'All');
    setCurrentPage(1);
  };

  const handlePaymentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentFilter(e.target.value as PaymentStatus | 'All');
    setCurrentPage(1);
  };

  return (
    <div>
       <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Folder: {folder.folderName}</h1>
            <Button leftIcon={<Icon name="upload" className="w-5 h-5"/>} onClick={() => openAddModal(folder.id)}>
              Upload Document
            </Button>
        </div>
        
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Documents" value={totalDocs} icon="document-text" color="bg-blue-500" />
        <StatCard title="Ready" value={readyDocs} icon="check-circle" color="bg-green-500" />
        <StatCard title="Export Errors" value={errorDocs} icon="x-circle" color="bg-red-500" />
        <StatCard title="Review Required" value={reviewDocs} icon="exclamation-circle" color="bg-yellow-500" />
      </div>

       {/* Search and Filter Controls */}
      <div className="mb-4 p-4 bg-white rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
             <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input
              type="text"
              placeholder="Search by supplier or invoice..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={processingFilter}
              onChange={handleProcessingFilterChange}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Processing Statuses</option>
              {Object.values(DocumentProcessingStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
           <div>
            <select
              value={paymentFilter}
              onChange={handlePaymentFilterChange}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Payment Statuses</option>
              {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Documents</h2>
          <p className="text-sm text-slate-500">{totalDocs} document(s) found</p>
        </div>
        <DocumentTable 
            documents={paginatedDocuments} 
            onDelete={(docId) => openDeleteModal(docId)}
            onDownload={(docId) => alert(`Downloading document ${docId}`)}
            onReprocess={(docId) => alert(`Reprocessing document ${docId}`)}
        />
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