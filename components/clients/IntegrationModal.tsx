import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Client } from '../../types';
import { Icon, IconName } from '../ui/Icon';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (integrationName: string) => void;
  client: Client | null;
}

const INTEGRATIONS: { name: string; icon: IconName }[] = [
  { name: 'QuickBooks', icon: 'quickbooks' },
  { name: 'Salesforce', icon: 'salesforce' },
  { name: 'Dropbox', icon: 'dropbox' },
];

const IntegrationModal: React.FC<IntegrationModalProps> = ({ isOpen, onClose, onConnect, client }) => {
  if (!client) return null;
  
  const currentIntegration = client.integration;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Integrations for ${client.companyName}`}>
      <div className="space-y-4">
        <p className="text-slate-600 text-sm">Select an application to connect with your client's folder.</p>
        
        <div className="border border-slate-200 rounded-lg divide-y divide-slate-200">
            {INTEGRATIONS.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-3">
                    <div className="flex items-center">
                        <Icon name={integration.icon} className="w-8 h-8 mr-3 text-slate-600"/>
                        <span className="font-medium text-slate-800">{integration.name}</span>
                    </div>
                    {currentIntegration === integration.name ? (
                        <Button variant="secondary" disabled>Connected</Button>
                    ) : (
                        <Button variant="primary" onClick={() => onConnect(integration.name)}>Connect</Button>
                    )}
                </div>
            ))}
        </div>

        <div className="pt-4 border-t border-slate-200">
            {currentIntegration !== 'No integration connected' && (
                 <Button 
                    variant="danger" 
                    onClick={() => onConnect('No integration connected')}
                    className="w-full"
                 >
                    Disconnect {currentIntegration}
                 </Button>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default IntegrationModal;
