
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileDrawer from './MobileDrawer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar />
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsDrawerOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
