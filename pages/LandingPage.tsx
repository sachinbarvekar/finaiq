import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, IconName } from '../components/ui/Icon';
import Button from '../components/ui/Button';

// --- Sub-components for Landing Page ---

const Header: React.FC = () => (
    <header className="absolute top-0 left-0 right-0 z-10 py-6">
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
                    <Button variant='secondary' size='sm' className="!bg-white !text-primary hover:!bg-slate-200">Get Started</Button>
                </Link>
            </div>
        </div>
    </header>
);

const FeatureCard: React.FC<{ icon: IconName; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
        <div className="mx-auto w-14 h-14 flex items-center justify-center bg-primary/10 rounded-xl mb-4">
            <Icon name={icon} className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">{title}</h3>
        <p className="text-slate-500">{description}</p>
    </div>
);

const HowItWorksStep: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 text-primary font-bold text-xl rounded-full font-display">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1 font-display">{title}</h3>
            <p className="text-slate-500">{description}</p>
        </div>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; title: string; avatar: string }> = ({ quote, name, title, avatar }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
        <p className="text-slate-600 mb-6">"{quote}"</p>
        <div className="flex items-center">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover mr-4" />
            <div>
                <p className="font-bold text-slate-800">{name}</p>
                <p className="text-sm text-slate-500">{title}</p>
            </div>
        </div>
    </div>
);

const Footer: React.FC = () => (
    <footer className="bg-dark text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-bold font-display mb-4">Finaiq</h3>
                    <p className="text-slate-400 text-sm">Intelligent Document Processing, Simplified.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Product</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-slate-400 hover:text-white">Features</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Pricing</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Integrations</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-3">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-slate-400 hover:text-white">About Us</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white">Contact</a></li>
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
    return (
        <div className="bg-slate-50 font-sans">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary to-primary-gradient-end text-white pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 font-display">Unlock Your Data. Automate Your Documents.</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/80 mb-8">
                        Finaiq uses advanced AI to extract, validate, and process your invoices, receipts, and documents with unparalleled accuracy and speed.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link to="/signup"><Button size="lg">Get Started for Free</Button></Link>
                        <Link to="/login"><Button size="lg" variant="secondary" className="!bg-white/20 !text-white hover:!bg-white/30">Request a Demo</Button></Link>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-display">Why Choose Finaiq?</h2>
                        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Go beyond simple OCR and transform your document workflow.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon="cpu-chip" title="Automated Data Extraction" description="Our AI accurately captures data from any document, eliminating manual entry and saving you hours." />
                        <FeatureCard icon="sparkles" title="Intelligent Validation" description="Finaiq validates data against your business rules, ensuring accuracy and compliance." />
                        <FeatureCard icon="puzzle-piece" title="Seamless Integrations" description="Connect Finaiq with your existing accounting software, ERP, and cloud storage in just a few clicks." />
                        <FeatureCard icon="chart-bar" title="Real-time Analytics" description="Gain valuable insights from your documents with our powerful, easy-to-use analytics dashboard." />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                 <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-display">Get Started in 3 Simple Steps</h2>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-10">
                        <HowItWorksStep number="1" title="Upload Documents" description="Securely upload your documents from anywhere—your computer, email, or cloud storage." />
                        <HowItWorksStep number="2" title="Process with AI" description="Our AI engine gets to work, extracting and verifying every piece of data in seconds." />
                        <HowItWorksStep number="3" title="Export & Analyze" description="Your structured, validated data is ready to be exported to your favorite tools." />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-display">Trusted by Businesses Worldwide</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <TestimonialCard 
                            quote="Finaiq has transformed our AP process. We've reduced our processing time by 80% and can now focus on more strategic tasks."
                            name="John Doe"
                            title="CFO, Innovate Inc."
                            avatar="https://i.pravatar.cc/80?u=john"
                        />
                         <TestimonialCard 
                            quote="The accuracy is incredible. It's a must-have tool for any company dealing with high volumes of documents. The support team is also fantastic."
                            name="Jane Smith"
                            title="Operations Manager, Synergy Solutions"
                            avatar="https://i.pravatar.cc/80?u=jane"
                        />
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="bg-white">
                <div className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-display">Ready to Revolutionize Your Workflow?</h2>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto mb-8">Join thousands of businesses streamlining their document processing with Finaiq.</p>
                     <Link to="/signup"><Button size="lg">Sign Up Now - It's Free</Button></Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
