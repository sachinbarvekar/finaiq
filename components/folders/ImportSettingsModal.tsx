
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Folder } from '../../types';
import { Icon } from '../ui/Icon';

interface ImportSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

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

const ImportSettingsModal: React.FC<ImportSettingsModalProps> = ({ isOpen, onClose, folder }) => {
  const [destination, setDestination] = useState('Purchases');
  const [splitOption, setSplitOption] = useState<'single' | 'auto'>('single');
  const [copySuccess, setCopySuccess] = useState('');
  
  const destinations = ['Purchases', 'Sales', 'Files', 'Bank statements'];
  
  if (!folder) return null;
  
  const folderEmail = `${folder.id.toLowerCase()}-inbox@finaiq.com`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(folderEmail).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Failed to copy');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Import Settings for ${folder.folderName}`}>
        <div className="space-y-6">
            <div>
                <h3 className="text-md font-semibold text-slate-700 mb-2">Default Destination</h3>
                <div className="grid grid-cols-2 gap-2">
                    {destinations.map(d => (
                        <ChoiceCard key={d} label={d} selected={destination === d} onClick={() => setDestination(d)} />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-md font-semibold text-slate-700 mb-2">Auto-Splitting</h3>
                <div className="grid grid-cols-1 gap-2">
                    <ChoiceCard 
                        label="Single invoice per file" 
                        description="Each file is treated as one document." 
                        selected={splitOption === 'single'} 
                        onClick={() => setSplitOption('single')} 
                    />
                    <ChoiceCard 
                        label="Auto-split multi-page files" 
                        description="AI splits files into individual invoices." 
                        selected={splitOption === 'auto'} 
                        onClick={() => setSplitOption('auto')} 
                    />
                </div>
            </div>
            
             <div>
                <h3 className="text-md font-semibold text-slate-700 mb-2">Email Forwarding</h3>
                <p className="text-sm text-slate-500 mb-2">Forward documents to this unique email address for automatic import.</p>
                <div className="relative">
                    <input 
                        type="text"
                        readOnly
                        value={folderEmail}
                        className="w-full pl-3 pr-24 py-2 bg-slate-100 text-slate-600 font-mono rounded-lg border border-slate-300"
                    />
                    <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={copyToClipboard}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2"
                    >
                        {copySuccess || 'Copy'}
                    </Button>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="button" onClick={onClose}>Save Settings</Button>
            </div>
        </div>
    </Modal>
  );
};

export default ImportSettingsModal;
