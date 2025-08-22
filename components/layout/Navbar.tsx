
import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="block">
            <img
              src="https://picsum.photos/id/237/200/200"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10">
              <a href="#profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Your Profile</a>
              <a href="#settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Settings</a>
              <hr className="my-1 border-slate-200" />
              <a href="#logout" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Sign Out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;