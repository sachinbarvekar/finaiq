
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
  const inactiveClass = 'text-slate-400 hover:bg-dark-accent hover:text-white';
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
    <aside className="hidden md:flex flex-col w-64 bg-dark text-white p-4">
      <div className="flex items-center mb-8 px-2">
         <Icon name="logo" className="w-8 h-8 text-primary" />
         <h1 className="ml-3 text-2xl font-bold text-white">Dashboard</h1>
      </div>
      <nav className="flex-1">
        <NavItem to="/" icon="dashboard" label="Dashboard" />
        <NavItem to="/clients" icon="users" label="Clients" />
        <NavItem to="/folders" icon="folder" label="Folders" />
        <NavItem to="/workflows" icon="workflow" label="Workflows" />
      </nav>
      <div className="mt-auto">
        <NavItem to="/settings" icon="settings" label="Settings" />
      </div>
    </aside>
  );
};

export default Sidebar;
