
import React from 'react';
import NavContent from './NavContent';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white p-4 border-r border-slate-200">
      <NavContent />
    </aside>
  );
};

export default Sidebar;
