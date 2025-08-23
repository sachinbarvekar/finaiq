
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@finaiq.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-gradient-end flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">FQ</span>
                </div>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
            <p className="text-slate-500 mt-2 text-sm">Sign in to your Finaiq account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-primary"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <p className="text-center text-xs text-slate-400 !mt-2">
              <b>Admin 1:</b> admin@finaiq.com / admin123<br/>
              <b>Admin 2:</b> admin2@finaiq.com / admin123<br/>
              <b>Client:</b> client@innovate.com / client123
            </p>

            <div className="flex items-center justify-end">
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot your password?
                </a>
            </div>

            <Button type="submit" className="w-full !py-2.5" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500 mb-3">Don't have an account?</p>
            <Link to="/signup">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-slate-500 hover:text-primary hover:underline">
                Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;