import { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am your AI Investment Assistant. How can I help you with the stock market today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/chat', { messages: updatedMessages });
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: response.data.text, 
        sender: 'bot' 
      }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: 'I apologize, but I encountered an error connecting to my servers. Please try again.', 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] max-w-4xl mx-auto flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
        <button 
          onClick={() => navigate("/app/dashboard")}
          className="text-gray-600 dark:text-gray-300 text-xl p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">AI Assistant</h2>
            <p className="text-xs text-emerald-600 dark:text-[#089981] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#089981] animate-pulse"></span> Online
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-[#2962FF] text-white' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white'}`}>
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-[#2962FF] text-white rounded-tr-none' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white rounded-tl-none shadow-sm'}`}>
              <div className="text-sm leading-relaxed prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="max-w-[80%] rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about stocks, indices, or market trends..." 
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-blue-600 dark:focus:border-[#2962FF] focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#2962FF]/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:text-gray-400 disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="p-3 bg-[#2962FF] text-white rounded-xl hover:bg-[#2962FF]/90 transition-colors shadow-sm disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
