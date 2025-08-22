import React from 'react';
import { Document } from '../../types';

interface InvoicePreviewProps {
  doc: Document;
  highlightedField: string | null;
}

const HighlightBox: React.FC<{ isVisible: boolean; top: string; left: string; width: string; height: string }> = ({ isVisible, top, left, width, height }) => (
    <div 
        className={`absolute bg-primary/20 border-2 border-primary rounded-sm transition-all duration-200 pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ top, left, width, height }}
    />
);

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ doc, highlightedField }) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="w-[8.5in] h-[11in] bg-white shadow-2xl p-16 font-serif text-gray-800 text-[12pt] relative">
            {/* Highlights Layer */}
            <HighlightBox isVisible={highlightedField === 'supplier'} top="4.2rem" left="4rem" width="14rem" height="1.8rem" />
            <HighlightBox isVisible={highlightedField === 'invoiceNumber'} top="7rem" left="27.5rem" width="8rem" height="1.5rem" />
            <HighlightBox isVisible={highlightedField === 'date'} top="8.5rem" left="29.2rem" width="6.3rem" height="1.5rem" />
            <HighlightBox isVisible={highlightedField === 'dueDate'} top="18rem" left="1rem" width="8.5rem" height="1.5rem" />
            <HighlightBox isVisible={highlightedField === 'amount'} top="34.8rem" left="30.5rem" width="5rem" height="1.8rem" />

            {/* Invoice Content */}
            <header className="flex justify-between items-start mb-16">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{doc.supplier}</h1>
                    <p className="text-gray-500">123 Business Rd, Suite 100</p>
                    <p className="text-gray-500">Business City, 12345</p>
                </div>
                <h2 className="text-5xl font-light text-gray-400 tracking-widest leading-tight">INVOICE</h2>
            </header>

            <section className="flex justify-between mb-16">
                <div>
                    <p className="text-gray-500">BILLED TO</p>
                    <p className="font-bold text-gray-900">Innovate Inc.</p>
                    <p>456 Innovation Drive</p>
                    <p>Tech City, 67890</p>
                </div>
                <div className="text-right">
                    <div className="grid grid-cols-2 gap-x-4">
                        <span className="text-gray-500">Invoice #</span><span className="font-medium text-gray-900">{doc.invoiceNumber}</span>
                        <span className="text-gray-500">Invoice Date</span><span className="font-medium text-gray-900">{formatDate(doc.date)}</span>
                        <span className="text-gray-500">Payment Due</span><span className="font-medium text-gray-900">{formatDate(doc.dueDate)}</span>
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-900">
                        <tr>
                            <th className="pb-2 font-bold uppercase tracking-wider">Description</th>
                            <th className="pb-2 font-bold uppercase tracking-wider text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200"><td className="py-4">Professional Services Rendered</td><td className="py-4 text-right">${(doc.amount * 0.7).toFixed(2)}</td></tr>
                        <tr className="border-b border-gray-200"><td className="py-4">Software License and Support</td><td className="py-4 text-right">${(doc.amount * 0.3).toFixed(2)}</td></tr>
                    </tbody>
                </table>
            </section>
            
            <section className="flex justify-end">
                <div className="w-2/5">
                    <div className="flex justify-between text-gray-700"><span>Subtotal</span><span>${doc.amount.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-700"><span>Taxes (0%)</span><span>$0.00</span></div>
                    <div className="border-t-2 border-gray-900 my-2"></div>
                    <div className="flex justify-between font-bold text-gray-900 text-2xl"><span>Total</span><span>${doc.amount.toFixed(2)}</span></div>
                </div>
            </section>
            
            <footer className="absolute bottom-16 left-16 right-16 text-center text-gray-500">
                <p>Thank you for your business!</p>
                <p>Please make payments to: {doc.supplier} | Account: 123456789</p>
            </footer>
        </div>
    );
};

export default InvoicePreview;
