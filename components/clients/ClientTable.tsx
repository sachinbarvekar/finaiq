import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, ClientStatus } from '../../types';
import Badge from '../ui/Badge';
import { Icon } from '../ui/Icon';

interface ClientTableProps {
  clients: Client[];
  onEdit: (clientId: string) => void;
  onDelete: (clientId: string) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleActionClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 text-sm font-semibold text-slate-600">Client Name</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Contact Name</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Email</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Phone</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
            <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr 
                key={client.id} 
                className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => navigate(`/dashboard/clients/${client.id}`)}
              >
                <td className="p-4 text-sm text-slate-800 font-medium">{client.companyName}</td>
                <td className="p-4 text-sm text-slate-600">{client.contactName}</td>
                <td className="p-4 text-sm text-slate-600">{client.email}</td>
                <td className="p-4 text-sm text-slate-600">{client.phone}</td>
                <td className="p-4">
                  <Badge color={client.status === ClientStatus.Active ? 'green' : 'gray'}>
                    {client.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-0 sm:space-x-2">
                     <button 
                      onClick={(e) => handleActionClick(e, () => navigate(`/dashboard/clients/${client.id}`))} 
                      className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-100 transition-colors" 
                      aria-label={`View ${client.companyName}`}
                    >
                        <Icon name="view" className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => handleActionClick(e, () => onEdit(client.id))} 
                      className="p-2 text-slate-500 hover:text-green-600 rounded-full hover:bg-slate-100 transition-colors" 
                      aria-label={`Edit ${client.companyName}`}
                    >
                        <Icon name="edit" className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => handleActionClick(e, () => onDelete(client.id))} 
                      className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-100 transition-colors" 
                      aria-label={`Delete ${client.companyName}`}
                    >
                        <Icon name="trash" className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
             <tr>
                <td colSpan={6} className="text-center p-8 text-slate-500">
                  No clients found.
                </td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;