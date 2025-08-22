
import React from 'react';
import NavContent from './NavContent';
import { Icon } from '../ui/Icon';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 transform transition-transform ease-in-out duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="p-4 flex flex-col h-full">
            <div className="flex justify-end items-center mb-4">
                <button onClick={onClose} className="p-2 text-slate-500 hover:text-primary rounded-md">
                    <span className="sr-only">Close menu</span>
                    <Icon name="x" className="w-6 h-6" />
                </button>
            </div>
            <NavContent onLinkClick={onClose} />
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
