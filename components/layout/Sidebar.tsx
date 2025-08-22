
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, IconName } from '../ui/Icon';

interface NavItemProps {
  to: string;
  icon: IconName;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const activeClass = 'bg-primary text-white';
  const inactiveClass = 'text-slate-500 hover:bg-slate-100 hover:text-primary';
  return (
    <NavLink
      to={to}
      end
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

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white p-4 border-r border-slate-200">
      <div className="flex items-center mb-8 px-2">
         <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-white text-xl font-bold">FQ</span>
        </div>
        <div>
            <h1 className="text-xl font-bold text-slate-800">Finaiq</h1>
            <p className="text-xs text-slate-500">Document Processing</p>
        </div>
      </div>
      <nav className="flex-1">
        <NavItem to="/" icon="dashboard" label="Dashboard" />
        <NavItem to="/clients" icon="users" label="Clients" />
        <NavItem to="/folders" icon="folder" label="Folders" />
      </nav>
    </aside>
  );
};

export default Sidebar;
