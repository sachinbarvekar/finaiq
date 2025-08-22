import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
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

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-end">
      <div className="flex items-center space-x-5">
        <button className="relative text-slate-500 hover:text-primary transition-colors">
          <Icon name="bell" className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full border-2 border-slate-200 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary overflow-hidden"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <img
              src="https://picsum.photos/id/237/200/200"
              alt="Admin Avatar"
              className="w-full h-full object-cover"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10">
              <a href="#profile" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <Icon name="user-circle" className="w-5 h-5 mr-3 text-slate-400" />
                <span>Your Profile</span>
              </a>
              <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <Icon name="preferences" className="w-5 h-5 mr-3 text-slate-400" />
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