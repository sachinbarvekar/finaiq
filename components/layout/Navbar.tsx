
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon, IconName } from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';

// Mock notifications
const notifications = [
    { id: 1, icon: 'document-text' as IconName, title: 'New Document Received', message: 'Invoice #INV-2024-008 from Office Supplies Co.', time: '5m ago' },
    { id: 2, icon: 'check-circle' as IconName, title: 'Export Complete', message: 'Export to QuickBooks was successful.', time: '1h ago' },
    { id: 3, icon: 'users' as IconName, title: 'New Client Added', message: 'Synergy Solutions has been added to your clients.', time: '3h ago' },
    { id: 4, icon: 'x-circle' as IconName, title: 'Export Failed', message: 'Failed to export documents for Innovate Inc.', time: '1d ago' },
];

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useProfile();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    logout();
  };

  if (!currentUser) {
    return (
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-primary transition-colors"
          aria-label="Open menu"
        >
          <Icon name="menu" className="w-6 h-6" />
        </button>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <button 
        onClick={onMenuClick}
        className="md:hidden text-slate-500 hover:text-primary transition-colors"
        aria-label="Open menu"
      >
        <Icon name="menu" className="w-6 h-6" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center space-x-5">
        <div className="relative" ref={notificationRef}>
          <button 
              onClick={() => setNotificationOpen(!notificationOpen)} 
              className="relative text-slate-500 hover:text-primary transition-colors"
              aria-haspopup="true"
              aria-expanded={notificationOpen}
          >
            <Icon name="bell" className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>
          {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-slate-200 z-10">
                  <div className="p-4 border-b border-slate-200">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                      <p className="text-xs text-slate-500">You have {notifications.length} unread messages.</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                      {notifications.map(notif => (
                          <div key={notif.id} className="flex items-start p-4 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mr-4">
                                  <Icon name={notif.icon} className="w-5 h-5 text-slate-500" />
                              </div>
                              <div className="flex-grow">
                                  <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                                  <p className="text-xs text-slate-500">{notif.message}</p>
                              </div>
                              <p className="text-xs text-slate-400 flex-shrink-0 ml-2">{notif.time}</p>
                          </div>
                      ))}
                  </div>
                   <div className="p-2 bg-slate-50 rounded-b-2xl">
                      <button className="w-full text-center text-sm font-semibold text-primary py-2 rounded-lg hover:bg-slate-100">
                          View all notifications
                      </button>
                  </div>
              </div>
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full border-2 border-slate-200 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary overflow-hidden"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10">
              <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <Icon name="user-circle" className="w-5 h-5 mr-3 text-slate-400" />
                <span>Your Profile</span>
              </Link>
              <Link to="/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <Icon name="settings" className="w-5 h-5 mr-3 text-slate-400" />
                <span>Settings</span>
              </Link>
              <hr className="my-1 border-slate-200" />
              <a href="#logout" onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <Icon name="logout" className="w-5 h-5 mr-3 text-slate-400" />
                <span>Sign Out</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
