import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, IconName } from '../components/ui/Icon';
import Button from '../components/ui/Button';

// --- Sub-components for Landing Page ---

const Header: React.FC = () => (
    <header className="absolute top-0 left-0 right-0 z-20 py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
            <Link to="/" className="flex items-center">
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow">
                    <span className="text-primary text-xl font-bold font-display">FQ</span>
                </div>
                <h1 className="text-xl font-bold text-white font-display">Finaiq</h1>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-white font-medium hover:text-white/80 transition">Sign In</Link>
                <Link to="/signup">
                    <Button variant='secondary' size='sm' className="!bg-white !text-primary hover:!bg-slate-200">Start AI Trial</Button>
                </Link>
            </div>
        </div>
    </header>
);

const SectionTitle: React.FC<{title: string, subtitle: string, isDark?: boolean}> = ({title, subtitle, isDark}) => (
    <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</h2>
        <p className={`mt-4 text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
    </div>
);

const Footer: React.FC = () => (
    <footer className="bg-dark-accent text-white">
        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <h3 className="text-lg font-bold font-display mb-4">Finaiq</h3>
                    <p className="text-slate-400 text-sm">AI-powered intelligent document processing for modern business.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Product</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-slate-400 hover:text-white">Features</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Pricing</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Security</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Integrations</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-3">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-slate-400 hover:text-white">About</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Blog</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-slate-400 hover:text-white">Help Center</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Documentation</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">API Reference</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Status</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="text-slate-400 hover:text-white"><Icon name="twitter" /></a>
                        <a href="#" className="text-slate-400 hover:text-white"><Icon name="linkedin" /></a>
                        <a href="#" className="text-slate-400 hover:text-white"><Icon name="github" /></a>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Finaiq. All rights reserved.
            </div>
        </div>
    </footer>
);

// --- Main Landing Page Component ---

const LandingPage: React.FC = () => {
    const platformIcons: Partial<Record<string, IconName>> = {
        'QuickBooks': 'quickbooks',
        'Salesforce': 'salesforce'
    };

    return (
        <div className="bg-white font-sans">
            <Header />

            {/* Hero Section */}
            <section 
                className="relative text-white pt-40 pb-24 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-dark/80"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">AI-Powered Enterprise Solution</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-300 mb-8">
                        Transform your business operations with AI-driven document processing. Extract, validate, and process invoices automatically with enterprise-grade accuracy and security.
                    </p>
                    <div className="flex justify-center space-x-4 mb-12">
                        <Link to="/signup"><Button size="lg">Start AI Processing</Button></Link>
                        <Link to="/login"><Button size="lg" variant="secondary" className="!bg-white !text-primary hover:!bg-slate-200">Watch AI Demo</Button></Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-200"><Icon name="cpu-chip" className="w-5 h-5" />AI-Powered</div>
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-200"><Icon name="badge-check" className="w-5 h-5" />99.8% Accuracy</div>
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-200"><Icon name="shield-check" className="w-5 h-5" />Enterprise Security</div>
                    </div>
                </div>
            </section>

            {/* AI Processing Workflow */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <SectionTitle title="AI Processing Workflow" subtitle="Intelligent automation from multiple input sources to structured business data" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {([
                            { icon: 'mail', title: 'Email Integration', desc: 'Forward invoices to a dedicated email for automatic processing.' },
                            { icon: 'chat-alt', title: 'WhatsApp Business', desc: 'Send documents via WhatsApp for instant mobile processing.' },
                            { icon: 'upload', title: 'Manual Upload', desc: 'Drag & drop files or batch upload through our secure portal.' },
                            { icon: 'cpu-chip', title: 'AI OCR', desc: 'Neural networks extract text with contextual understanding.' },
                            { icon: 'sparkles', title: 'Smart Extraction', desc: 'AI identifies key fields, amounts, dates, and vendor info.' },
                            { icon: 'badge-check', title: 'Validation', desc: 'Business rules and compliance checks ensure data accuracy.' },
                            { icon: 'puzzle-piece', title: 'Integration', desc: 'Seamless export to ERP systems and accounting software.' },
                            { icon: 'server', title: 'Structured Data', desc: 'Ready for ERP integration with 99.8% accuracy in 2-15 seconds.' }
                        ]).map(step => (
                            <div key={step.title} className="bg-white p-6 rounded-xl border border-slate-200">
                                <Icon name={step.icon as IconName} className="w-8 h-8 text-primary mb-3" />
                                <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Integrations Section */}
            <section className="py-20">
                 <div className="container mx-auto px-6">
                    <SectionTitle title="Seamless Integrations" subtitle="Connect with Your Existing Systems for seamless data flow and workflow automation." />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center"><Icon name="briefcase" className="w-5 h-5 mr-2 text-primary"/>Accounting & Finance Platforms</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {['TallyPrime', 'Zoho', 'QuickBooks', 'Xero', 'FreshBooks', 'Wave'].map(name => {
                                        const iconName = platformIcons[name];
                                        return (
                                            <div key={name} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center font-medium text-slate-700 flex items-center justify-center gap-2">
                                                {iconName && <Icon name={iconName} className="w-5 h-5 text-slate-600"/>}
                                                <span>{name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center"><Icon name="academic-cap" className="w-5 h-5 mr-2 text-primary"/>Enterprise & CRM Platforms</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {['Salesforce', 'SAP', 'HubSpot', 'Microsoft'].map(name => {
                                         const iconName = platformIcons[name];
                                         return (
                                             <div key={name} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center font-medium text-slate-700 flex items-center justify-center gap-2">
                                                 {iconName && <Icon name={iconName} className="w-5 h-5 text-slate-600"/>}
                                                 <span>{name}</span>
                                             </div>
                                         );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col">
                            <h3 className="font-bold text-slate-800 text-lg">Custom API Integration</h3>
                            <p className="text-slate-500 text-sm mt-2 flex-grow">Our flexible REST API enables integration with any business system. Our team provides custom support for enterprise clients.</p>
                            <div className="mt-4 space-y-2">
                                <Button variant='outline' className="w-full">View API Documentation</Button>
                                <Button variant='secondary' className="w-full">Request Custom Integration</Button>
                            </div>
                        </div>
                    </div>
                     <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-start space-x-4">
                            <Icon name="reprocess" className="w-8 h-8 text-primary flex-shrink-0 mt-1"/>
                            <div>
                                <h4 className="font-bold text-slate-800">Real-time Sync</h4>
                                <p className="text-sm text-slate-500 mt-1">Processed documents automatically sync to your business systems in real-time.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Icon name="shield-check" className="w-8 h-8 text-primary flex-shrink-0 mt-1"/>
                            <div>
                                <h4 className="font-bold text-slate-800">Secure Connection</h4>
                                <p className="text-sm text-slate-500 mt-1">Enterprise-grade security with encrypted data transmission and OAuth 2.0.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Icon name="puzzle-piece" className="w-8 h-8 text-primary flex-shrink-0 mt-1"/>
                            <div>
                                <h4 className="font-bold text-slate-800">Zero Disruption</h4>
                                <p className="text-sm text-slate-500 mt-1">Seamless integration that works with your existing workflows and processes.</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </section>

            {/* AI-Powered Features */}
            <section className="py-20 bg-dark-accent">
                <div className="container mx-auto px-6">
                    <SectionTitle title="AI-Powered Features" subtitle="Advanced AI capabilities designed for modern business operations and enterprise efficiency." isDark/>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {([
                            { icon: 'pencil-alt', title: 'Neural OCR', feats: ['Advanced text recognition', 'Handwritten text recognition', 'Multi-language processing', 'Context-aware extraction'] },
                            { icon: 'shield-check', title: 'Enterprise Security', feats: ['SOC 2 Type II certified', 'End-to-end encryption', 'GDPR & CCPA compliant'] },
                            { icon: 'trending-up', title: 'AI Analytics', feats: ['Predictive modeling', 'Anomaly detection', 'Performance optimization'] }
                        ]).map(f => (
                            <div key={f.title} className="bg-dark p-6 rounded-2xl border border-slate-700">
                                <Icon name={f.icon as IconName} className="w-8 h-8 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-white font-display mb-3">{f.title}</h3>
                                <ul className="space-y-2">
                                    {f.feats.map(feat => <li key={feat} className="flex items-center text-slate-400 text-sm"><Icon name="check-circle" className="w-4 h-4 mr-2 text-green-500"/>{feat}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-primary text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div><p className="text-3xl font-bold font-display">99.8%</p><p className="text-sm opacity-80">Accuracy Rate</p></div>
                        <div><p className="text-3xl font-bold font-display">2s</p><p className="text-sm opacity-80">Average Processing</p></div>
                        <div><p className="text-3xl font-bold font-display">50M+</p><p className="text-sm opacity-80">Documents Processed</p></div>
                        <div><p className="text-3xl font-bold font-display">500+</p><p className="text-sm opacity-80">Enterprise Clients</p></div>
                    </div>
                </div>
            </section>

            {/* Why Choose Finaiq? */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <SectionTitle title="Why Choose Finaiq?" subtitle="Experience professional document processing with enterprise-grade reliability."/>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4"><Icon name="rocket-launch" className="w-8 h-8 text-primary mt-1 flex-shrink-0"/><div><h3 className="font-bold text-slate-800">95% Time Reduction</h3><p className="text-slate-500 text-sm">Process documents in seconds instead of hours.</p></div></div>
                            <div className="flex items-start space-x-4"><Icon name="chart-pie" className="w-8 h-8 text-primary mt-1 flex-shrink-0"/><div><h3 className="font-bold text-slate-800">Real-time Analytics</h3><p className="text-slate-500 text-sm">Get instant insights into your AP processes.</p></div></div>
                            <div className="flex items-start space-x-4"><Icon name="users" className="w-8 h-8 text-primary mt-1 flex-shrink-0"/><div><h3 className="font-bold text-slate-800">Team Collaboration</h3><p className="text-slate-500 text-sm">Enable seamless collaboration with role-based access.</p></div></div>
                        </div>
                        <div className="lg:col-span-2 bg-slate-50 p-8 rounded-2xl border border-slate-200">
                             <div className="bg-white p-6 rounded-xl shadow-md border max-w-sm mx-auto">
                                <p className="font-bold text-slate-800">AI Processing</p>
                                <div className="mt-4 space-y-3">
                                    {[
                                        {label: "Data Extraction", status: "Complete"},
                                        {label: "Processing", status: "Complete"},
                                        {label: "Validation", status: "Pending"},
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${item.status === 'Complete' ? 'bg-green-500' : 'bg-slate-300'}`}>
                                                {item.status === 'Complete' && <Icon name="check-circle" className="w-4 h-4 text-white"/>}
                                            </div>
                                            <p className={`font-medium ${item.status === 'Complete' ? 'text-slate-800' : 'text-slate-500'}`}>{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-500">AI Confidence: <span className="font-bold text-green-600">99.2%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <SectionTitle title="Trusted by AI-Forward Companies" subtitle="Leading businesses trust Finaiq AI for intelligent document processing"/>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-slate-600 mb-6 text-sm">"Finaiq AI revolutionized our document processing. The intelligent automation and business insights are game-changing."</p>
                            <p className="font-bold text-slate-800">Sarah Chen</p><p className="text-sm text-slate-500">CFO, TechCorp</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                             <p className="text-slate-600 mb-6 text-sm">"The AI-powered accuracy and intelligent workflow automation have transformed our financial operations completely."</p>
                            <p className="font-bold text-slate-800">Michael Rodriguez</p><p className="text-sm text-slate-500">Finance Director, GlobalInc</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                             <p className="text-slate-600 mb-6 text-sm">"Incredible AI capabilities with enterprise reliability. Finaiq's intelligent processing delivers exceptional ROI."</p>
                            <p className="font-bold text-slate-800">Emily Zhang</p><p className="text-sm text-slate-500">AP Manager, FinanceFlow</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section 
                className="relative bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-dark-accent/80"></div>
                <div className="container mx-auto px-6 py-20 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-display">Ready for Intelligent Automation?</h2>
                    <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto mb-8">Join forward-thinking companies using Finaiq AI for intelligent document processing and business automation.</p>
                     <div className="flex justify-center items-center space-x-4">
                        <Link to="/signup"><Button size="lg">Start AI Trial</Button></Link>
                        <Link to="/login"><Button size="lg" variant='secondary' className="!bg-white !text-primary hover:!bg-slate-200">See AI Demo</Button></Link>
                     </div>
                     <p className="text-xs text-slate-400 mt-4">AI-powered trial • Intelligent onboarding • Expert support</p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;