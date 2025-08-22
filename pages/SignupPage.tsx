import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock signup process
        setTimeout(() => {
            setIsLoading(false);
            alert('Account created successfully! Please sign in.');
            navigate('/login');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-primary-gradient-end flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">FQ</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
                        <p className="text-slate-500 mt-2 text-sm">Join Finaiq to streamline your document processing</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" id="fullName" placeholder="Enter your full name" required className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" id="email" placeholder="sagar@agrobeet.com" required className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input type="tel" id="phone" placeholder="Enter your phone number" required className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                         <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                            <input type="text" id="companyName" placeholder="Enter your company name" required className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} id="password" placeholder="••••••••••••" required className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-primary">
                                    <Icon name={showPassword ? 'eye-off' : 'eye'} className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" placeholder="••••••••••••" required className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-primary">
                                    <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full !py-2.5" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;