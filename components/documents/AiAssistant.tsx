
import React, { useState } from 'react';
import { Document } from '../../types';
import { Icon } from '../ui/Icon';
import Button from '../ui/Button';
// NOTE: The GoogleGenerativeAI class and API key handling are mocked for this environment.
// In a real application, these would be imported from '@google/genai' and handled securely.
// import { GoogleGenerativeAI } from '@google/genai';

interface AiAssistantProps {
    document: Document;
}

type Message = {
    role: 'user' | 'model' | 'system';
    text: string;
};

const AiAssistant: React.FC<AiAssistantProps> = ({ document }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'system', text: 'Hello! I am your AI assistant. How can I help you with this invoice?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // MOCK Gemini API call
    const mockGenerateContent = async (prompt: string): Promise<string> => {
        setIsLoading(true);
        console.log("Sending prompt to Mock AI:", prompt);
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

        let response = "I'm sorry, I can only provide mock responses in this example. ";
        if (prompt.toLowerCase().includes('summarize')) {
            response = `This is an invoice from **${document.supplier}** (Invoice #${document.invoiceNumber}) for **$${document.amount.toFixed(2)}**. It was issued on ${document.date} and is due on ${document.dueDate}. The current payment status is **${document.payment}**.`;
        } else if (prompt.toLowerCase().includes('flag') || prompt.toLowerCase().includes('issue')) {
            response = `Based on the data, one potential issue to flag is that the payment status is **${document.payment}** and the due date is ${document.dueDate}. You may want to verify this.`;
        } else if (prompt.toLowerCase().includes('amount')) {
             response = `The total amount for invoice #${document.invoiceNumber} is **$${document.amount.toFixed(2)} USD**.`;
        }
        
        setIsLoading(false);
        return response;
    };

    const handleSend = async (promptText: string) => {
        if (!promptText.trim()) return;

        const newUserMessage: Message = { role: 'user', text: promptText };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');

        const aiResponse = await mockGenerateContent(promptText);
        const newAiMessage: Message = { role: 'model', text: aiResponse };
        setMessages(prev => [...prev, newAiMessage]);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role !== 'user' && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon name="sparkles" className="w-5 h-5 text-primary" />
                            </div>
                        )}
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.role === 'user' ? 'bg-primary text-white rounded-br-lg' : 
                            msg.role === 'model' ? 'bg-slate-100 text-slate-800 rounded-bl-lg' : 
                            'bg-transparent text-slate-600 text-sm'
                        }`}>
                            <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon name="sparkles" className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <div className="max-w-[80%] p-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-lg">
                           <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                           </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-shrink-0 pt-4 mt-2">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button variant="outline" size="sm" onClick={() => handleSend("Summarize this invoice")}>Summarize</Button>
                    <Button variant="outline" size="sm" onClick={() => handleSend("Flag potential issues")}>Flag issues</Button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about this invoice..."
                        className="w-full pr-12 pl-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button type="submit" disabled={isLoading} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-primary disabled:text-slate-300">
                        <Icon name="paper-airplane" className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AiAssistant;
