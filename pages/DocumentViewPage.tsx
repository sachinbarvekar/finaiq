import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDocuments } from '../contexts/DocumentContext';
import NotFound from './NotFound';
import { Icon } from '../components/ui/Icon';
import Button from '../components/ui/Button';
import InvoicePreview from '../components/documents/InvoicePreview';
import DocumentViewSidebar from '../components/documents/DocumentViewSidebar';

const DocumentViewPage: React.FC = () => {
    const { folderId, documentId } = useParams<{ folderId: string, documentId: string }>();
    const { getDocumentById, openDeleteModal, updateDocument } = useDocuments();
    const navigate = useNavigate();

    // UI State
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [highlightedField, setHighlightedField] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);

    const document = documentId ? getDocumentById(documentId) : undefined;

    if (!document || document.folderId !== folderId) {
        return <NotFound />;
    }

    const handleDelete = () => {
        openDeleteModal(document.id, () => {
            navigate(`/dashboard/folders/${folderId}`);
        });
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
    
    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* --- Header --- */}
            <header className="flex items-center justify-between p-3 border-b border-slate-200 flex-shrink-0">
                <Link to={`/dashboard/folders/${folderId}`} className="text-sm text-primary hover:underline flex items-center">
                    <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                    <span>Back to Documents</span>
                </Link>
                
                <div className="flex items-center space-x-2">
                    {/* Zoom Controls */}
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                        <button onClick={handleZoomOut} className="p-1.5 text-slate-500 hover:bg-white rounded-md"><Icon name="zoom-out" className="w-5 h-5"/></button>
                        <span className="w-12 text-center text-sm font-medium text-slate-600">{(zoom * 100).toFixed(0)}%</span>
                        <button onClick={handleZoomIn} className="p-1.5 text-slate-500 hover:bg-white rounded-md"><Icon name="zoom-in" className="w-5 h-5"/></button>
                    </div>

                    <div className="h-6 border-l border-slate-200 mx-2"></div>
                    
                    {/* Action Buttons */}
                    <Button variant="secondary" leftIcon={<Icon name="download" className="w-4 h-4" />}>Download</Button>
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
                <main className="flex-1 bg-slate-50 overflow-auto p-4 md:p-8 flex items-center justify-center">
                    <div style={{ transform: `scale(${zoom})` }} className="transition-transform duration-200">
                       <InvoicePreview doc={document} highlightedField={highlightedField} />
                    </div>
                </main>

                {/* --- Details Sidebar --- */}
                <aside className={`transition-all duration-300 ease-in-out flex-shrink-0 bg-white border-l border-slate-200 ${isPanelOpen ? 'w-96' : 'w-0 overflow-hidden'}`}>
                   {isPanelOpen && (
                        <DocumentViewSidebar 
                            document={document}
                            onUpdate={updateDocument}
                            onDelete={handleDelete} 
                            onFieldHover={setHighlightedField}
                        />
                   )}
                </aside>
            </div>
        </div>
    );
};

export default DocumentViewPage;