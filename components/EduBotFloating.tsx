
import React, { useState, useRef, useEffect } from 'react';
import { getAILearningResponse } from '../services/geminiService';
import { useUser } from '../context/UserContext';

const EduBotFloating: React.FC = () => {
  const { user, addXP } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string, links?: {title: string, uri: string}[] }[]>([
    { role: 'ai', text: `Hello ${user.name.split(' ')[0]}. I am your professional growth assistant. How can I facilitate your learning today?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const context = `Profile: ${user.name}, Level: ${user.level}. Focus: ${user.interests.join(', ')}.`;
    try {
      const aiResponse = await getAILearningResponse(userMsg, context);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: aiResponse.text, 
        links: aiResponse.groundingLinks 
      }]);
      addXP(10);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Service temporarily delayed. Please re-initiate your query." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[200] size-14 bg-primary text-white rounded-xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <i className="ph ph-sparkle text-2xl"></i>
      </button>
    );
  }

  return (
    <div className={`fixed z-[200] transition-all duration-300 ease-in-out ${
      isExpanded 
      ? 'inset-6 lg:inset-12' 
      : 'bottom-6 right-6 w-[340px] sm:w-[380px] h-[520px]'
    } bg-surface-light dark:bg-surface-dark shadow-2xl rounded-xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95`}>
      
      {/* Assistant Header */}
      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <i className="ph ph-sparkle text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-xs">Growth Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Operational</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
          >
            <i className={`ph ${isExpanded ? 'ph-corners-in' : 'ph-corners-out'} text-lg`}></i>
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <i className="ph ph-x text-lg"></i>
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-slate-50/20 dark:bg-transparent">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[90%] flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
              <div className={`px-4 py-2.5 rounded-xl text-[12px] leading-relaxed ${
                m.role === 'ai' 
                ? 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 shadow-sm' 
                : 'bg-primary text-white'
              }`}>
                {m.text}
              </div>
              {m.links && m.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 w-full">
                  {m.links.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" 
                       className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] text-primary font-bold uppercase tracking-wider hover:border-primary transition-all flex items-center gap-1">
                      <i className="ph ph-link text-xs"></i>
                      <span className="truncate max-w-[110px]">{link.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 items-center text-slate-400 text-[9px] font-bold uppercase tracking-wider">
               <div className="flex gap-1">
                 <div className="size-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                 <div className="size-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                 <div className="size-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
               </div>
               Processing Query
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-white/5">
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[12px] px-2 font-medium"
            placeholder="Ask a career question..."
          />
          <button 
            onClick={handleSend}
            className="size-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all"
          >
            <i className="ph-fill ph-paper-plane-right text-base"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EduBotFloating;
