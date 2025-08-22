import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocuments } from '../contexts/DocumentContext';
import { useClients } from '../contexts/ClientContext';
import { Document, DocumentProcessingStatus } from '../types';
import AllDocumentsTable from '../components/documents/AllDocumentsTable';
import Pagination from '../components/ui/Pagination';
import { Icon } from '../components/ui/Icon';

const DOCUMENTS_PER_PAGE = 10;

const AllDocumentsPage: React.FC = () => {
    const { documents, openEditModal, openDeleteModal } = useDocuments();
    const { clients } = useClients();
    const [searchParams] = useSearchParams();

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<DocumentProcessingStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const initialStatus = searchParams.get('status');
        if (initialStatus && Object.values(DocumentProcessingStatus).includes(initialStatus as DocumentProcessingStatus)) {
            setStatusFilter(initialStatus as DocumentProcessingStatus);
        } else if (initialStatus === 'all') {
            setStatusFilter('all');
        }
    }, [searchParams]);

    const documentsWithClient = useMemo(() => {
        return documents.map(doc => {
            const folder = clients.find(c => c.folderId === doc.folderId);
            return {
                ...doc,
                clientName: folder ? folder.companyName : 'Unknown Client'
            };
        });
    }, [documents, clients]);

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
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">All Documents</h1>
            
            {/* Controls */}
            <div className="mb-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
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
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <AllDocumentsTable 
                    documents={paginatedDocuments}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
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

export default AllDocumentsPage;
