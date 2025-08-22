
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'yellow' | 'gray';
}

const Badge: React.FC<BadgeProps> = ({ children, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-slate-200 text-slate-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

export default Badge;
