
import React, { useState } from 'react';
import { Icon } from '../components/ui/Icon';

const workflows = [
    {
        id: 'auto-approve',
        title: 'Auto-approve invoices',
        description: 'Automatically approve invoices from trusted suppliers under a specified amount.',
        enabled: true,
    },
    {
        id: 'new-supplier-flag',
        title: 'Flag new suppliers',
        description: 'Invoices from suppliers not in your database will be flagged for manual review.',
        enabled: true,
    },
    {
        id: 'weekly-reports',
        title: 'Send weekly summary reports',
        description: 'Receive a summary of all processed documents every Monday morning.',
        enabled: false,
    },
    {
        id: 'error-notify',
        title: 'Notify on export errors',
        description: 'Get an immediate email notification if a document fails to export to your accounting software.',
        enabled: true,
    },
    {
        id: 'overdue-reminder',
        title: 'Overdue invoice reminders',
        description: 'Send automated reminders for invoices that are approaching their due date.',
        enabled: false,
    },
];

const WorkflowCard: React.FC<{ title: string; description: string; enabled: boolean; onToggle: () => void; }> = ({ title, description, enabled, onToggle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start justify-between">
        <div className="pr-4">
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <button
            onClick={onToggle}
            className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${enabled ? 'bg-primary' : 'bg-slate-300'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-6' : ''}`} />
        </button>
    </div>
);


const Workflows: React.FC = () => {
    const [workflowStates, setWorkflowStates] = useState<Record<string, boolean>>(
        workflows.reduce((acc, wf) => ({ ...acc, [wf.id]: wf.enabled }), {})
    );

    const handleToggle = (id: string) => {
        setWorkflowStates(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Workflows</h1>
            </div>
            <p className="text-slate-600 mb-6 max-w-2xl">
                Automate your document processing with custom workflows. Enable or disable rules to fit your business needs and streamline your operations.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {workflows.map(wf => (
                    <WorkflowCard
                        key={wf.id}
                        title={wf.title}
                        description={wf.description}
                        enabled={workflowStates[wf.id]}
                        onToggle={() => handleToggle(wf.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Workflows;