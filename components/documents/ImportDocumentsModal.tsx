import React, { useState, useRef, useCallback } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Folder } from '../../types';

interface ImportDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

// Helper component for file list items
const FileListItem: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
    // Mock progress for UI purposes
    const [progress] = useState(Math.floor(Math.random() * 40) + 60); 

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        <div className="flex items-center p-2 bg-slate-100 rounded-lg">
            <Icon name="document-text" className="w-8 h-8 text-slate-400 flex-shrink-0 mr-3" />
            <div className="flex-grow overflow-hidden">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <div className="flex items-center mt-1">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mr-2">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 whitespace-nowrap">{formatBytes(file.size)}</p>
                </div>
            </div>
            <button onClick={onRemove} className="ml-3 text-slate-400 hover:text-red-500 p-1 rounded-full flex-shrink-0">
                <Icon name="trash" className="w-4 h-4" />
            </button>
        </div>
    );
};


const ImportDocumentsModal: React.FC<ImportDocumentsModalProps> = ({ isOpen, onClose, folder }) => {
    const [destination, setDestination] = useState('Purchases');
    const [splitOption, setSplitOption] = useState<'single' | 'auto'>('single');
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const destinations = ['Purchases', 'Sales', 'Files', 'Bank statements'];

    const resetState = useCallback(() => {
        setDestination('Purchases');
        setSplitOption('single');
        setFiles([]);
        setIsDragging(false);
    }, []);

    const handleClose = () => {
        resetState();
        onClose();
    };
    
    const handleFilesSelected = (selectedFiles: FileList) => {
        const newFiles = Array.from(selectedFiles);
        setFiles(prev => [...prev, ...newFiles].filter((file, index, self) => 
            index === self.findIndex((f) => f.name === file.name && f.size === file.size)
        ));
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Necessary for onDrop to work
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };
    
    const removeFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    const Section: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
        <div>
            <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full font-bold text-sm mr-2">{number}</div>
                <h3 className="text-md font-semibold text-slate-700">{title}</h3>
            </div>
            <div className="pl-8">{children}</div>
        </div>
    );

    const ChoiceCard: React.FC<{ label: string; description?: string; selected: boolean; onClick: () => void; }> = ({ label, description, selected, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className={`w-full p-3 border rounded-lg text-left transition-all duration-200 flex items-start space-x-3 ${
                selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
        >
            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected ? 'border-primary' : 'border-slate-400'}`}>
                {selected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
            </div>
            <div>
                <p className={`font-semibold ${selected ? 'text-primary' : 'text-slate-800'}`}>{label}</p>
                {description && <p className="text-xs text-slate-500">{description}</p>}
            </div>
        </button>
    );

    if (!folder) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Import documents to: ${folder.folderName}`}>
            <div className="space-y-6">
                
                <Section number={1} title="Select destination">
                    <div className="grid grid-cols-2 gap-2">
                        {destinations.map(d => (
                            <ChoiceCard key={d} label={d} selected={destination === d} onClick={() => setDestination(d)} />
                        ))}
                    </div>
                </Section>

                <Section number={2} title="Choose splitting option">
                     <div className="grid grid-cols-1 gap-2">
                        <ChoiceCard 
                            label="Single invoice" 
                            description="Each file is a single invoice." 
                            selected={splitOption === 'single'} 
                            onClick={() => setSplitOption('single')} 
                        />
                        <ChoiceCard 
                            label="Auto-split" 
                            description="Split files into individual invoices." 
                            selected={splitOption === 'auto'} 
                            onClick={() => setSplitOption('auto')} 
                        />
                    </div>
                </Section>

                <Section number={3} title="Upload files">
                    <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                            isDragging ? 'border-primary bg-primary/10' : 'border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                            className="hidden"
                        />
                        <div className="mx-auto w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full mb-2">
                            <Icon name="upload" className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                            <span className="text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG, DOCX, etc.</p>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                             <h4 className="text-sm font-medium text-slate-600">Files to import ({files.length})</h4>
                            <div className="max-h-40 overflow-y-auto space-y-2 pr-2 border-t pt-2">
                                {files.map((file, index) => (
                                    <FileListItem key={`${file.name}-${index}`} file={file} onRemove={() => removeFile(index)} />
                                ))}
                            </div>
                        </div>
                    )}
                </Section>
            </div>
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-200">
                <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button type="button" onClick={handleClose} disabled={files.length === 0}>
                    Import {files.length > 0 ? `${files.length} File(s)` : ''}
                </Button>
            </div>
        </Modal>
    );
};

export default ImportDocumentsModal;
