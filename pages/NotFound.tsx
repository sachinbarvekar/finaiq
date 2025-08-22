
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-2xl font-semibold text-slate-800 mt-4">Page Not Found</p>
      <p className="text-slate-500 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;
