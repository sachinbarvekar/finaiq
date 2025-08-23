
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, IconName } from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';

interface NavItemProps {
  to: string;
  icon: IconName;
  label: string;
  onLinkClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onLinkClick }) => {
  const activeClass = 'bg-primary text-white';
  const inactiveClass = 'text-slate-500 hover:bg-slate-100 hover:text-primary';
  return (
    <NavLink
      to={to}
      end
      onClick={onLinkClick}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
          isActive ? activeClass : inactiveClass
        }`
      }
    >
      <Icon name={icon} className="w-5 h-5" />
      <span className="ml-4 font-medium">{label}</span>
    </NavLink>
  );
};

interface NavContentProps {
    onLinkClick?: () => void;
}

const NavContent: React.FC<NavContentProps> = ({ onLinkClick }) => {
    const { user } = useAuth();

    const adminNav = (
      <>
        <NavItem to="/dashboard" icon="dashboard" label="Dashboard" onLinkClick={onLinkClick} />
        <NavItem to="/dashboard/clients" icon="users" label="Clients" onLinkClick={onLinkClick} />
        <NavItem to="/dashboard/folders" icon="folder" label="Folders" onLinkClick={onLinkClick} />
        <NavItem to="/dashboard/documents" icon="document-text" label="All Documents" onLinkClick={onLinkClick} />
        <NavItem to="/dashboard/workflows" icon="workflow" label="Workflows" onLinkClick={onLinkClick} />
      </>
    );

    const clientNav = user?.folderId ? (
      <>
        <NavItem to="/dashboard" icon="dashboard" label="Dashboard" onLinkClick={onLinkClick} />
        <NavItem to={`/dashboard/folders/${user.folderId}`} icon="document" label="My Documents" onLinkClick={onLinkClick} />
      </>
    ) : null;


    return (
        <>
            <div className="flex items-center mb-8 px-2">
                <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl font-bold">FQ</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Finaiq</h1>
                    <p className="text-xs text-slate-500">
                      {user?.role === 'Admin' ? 'Document Processing' : (user?.team || 'Client Portal')}
                    </p>
                </div>
            </div>
            <nav className="flex-1">
                {user?.role === 'Admin' ? adminNav : clientNav}
            </nav>
        </>
    );
};

export default NavContent;
