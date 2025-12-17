import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, ShieldCheck, AlertTriangle, Zap, XCircle } from 'lucide-react';
import { ChatBubble } from './components/ChatBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { SignalModal } from './components/SignalModal';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Message, Role } from './types';
import { sendMessageToGemini, resetChatSession } from './services/geminiService';
import { APP_NAME } from './constants';
import { initTelegram, getUserName, closeApp } from './services/telegramService';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    initTelegram();
  }, []);

  const updatePhaseFromResponse = (text: string) => {
    const phaseMatch = text.match(/\[PHASE:\s*(\d)\]/);
    if (phaseMatch && phaseMatch[1]) {
      const phaseNum = parseInt(phaseMatch[1], 10);
      if (!isNaN(phaseNum) && phaseNum >= 1 && phaseNum <= 4) {
        setCurrentPhase(phaseNum);
      }
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      resetChatSession();
      const userName = getUserName();
      setTimeout(() => {
        const welcomeMsg: Message = {
          id: 'welcome',
          role: Role.MODEL,
          content: `Ciao ${userName}! 👋 Benvenuto nella **SafeTrade Academy**.\n\nOggi sarò il tuo mentore personale. Ti guiderò passo dopo passo nell'apertura di un trade **Risk Free** su MEXC.\n\nNiente rischi reali, solo pratica. Sei pronto a diventare un cecchino dei mercati? 🎯\n\nScrivi "Sono pronto" per iniziare!`,
          timestamp: new Date()
        };
        setMessages([welcomeMsg]);
      }, 500);
    }
  }, []);

  const handleSendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || inputText.trim();
    if (!textToSend || isLoading) return;

    if (!overrideText) setInputText('');
    setError(null);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const aiResponseText = await sendMessageToGemini(textToSend, messages);
      updatePhaseFromResponse(aiResponseText);
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (err) {
      console.error(err);
      setError("C'è stato un problema di connessione. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Vuoi ricominciare la lezione da capo?")) {
      window.location.reload();
    }
  };

  const handleSignalSubmit = (data: { pair: string; side: string; entry: string; sl: string; tp: string }) => {
    const signalMessage = `🚨 **SIMULAZIONE SEGNALE RICEVUTO** 🚨\n\n🔹 **Coppia:** ${data.pair}\n🔹 **Lato:** ${data.side === 'LONG' ? 'LONG 🟢' : 'SHORT 🔴'}\n🔹 **Entry:** ${data.entry}\n🔹 **Stop Loss:** ${data.sl}\n🔹 **Take Profit:** ${data.tp}\n\nHo ricevuto questo segnale dal bot. Guidami passo passo nell'inserimento dell'ordine su MEXC seguendo le regole di gestione del rischio.`;
    handleSendMessage(undefined, signalMessage);
  };

  return (
    // MODIFICA 1: h-[100dvh] forza l'altezza reale ignorando le barre del browser
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-200 font-sans relative overflow-hidden">
      
      {/* Header */}
      <header className="flex-none bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight animate-text-shimmer">{APP_NAME}</h1>
            <p className="text-xs text-emerald-400 font-medium">Risk Management Tutor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              title="Ricomincia Lezione"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={closeApp}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition-colors"
              title="Chiudi Academy"
            >
              <XCircle size={20} />
            </button>
        </div>
      </header>

      {/* Progress Bar */}
      <ProgressIndicator currentPhase={currentPhase} />

      {/* Main Chat Area */}
      {/* MODIFICA 2: pb-44 per creare spazio vuoto in fondo così l'ultimo messaggio non finisce sotto il footer fisso */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative scroll-smooth pb-44">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        {error && (
          <div className="flex justify-center my-4">
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      {/* MODIFICA 3: fixed bottom-0 blocca la barra in basso sopra a tutto */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 pb-8 md:pb-6 safe-area-padding z-50 shadow-2xl">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={() => setIsSignalModalOpen(true)}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 flex items-center justify-center transition-all shadow-lg shadow-amber-900/20 active:scale-95"
            title="Simula Segnale Bot"
          >
            <Zap size={20} />
          </button>

          <form onSubmit={(e) => handleSendMessage(e)} className="flex-1 flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Scrivi la tua risposta..."
              className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder-slate-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 flex items-center justify-center transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
        <div className="text-center mt-2">
           <p className="text-[10px] text-slate-500">
             Powered by Gemini 2.5 Flash • Trading involves risk
           </p>
        </div>
      </footer>

      {/* Modals */}
      <SignalModal 
        isOpen={isSignalModalOpen} 
        onClose={() => setIsSignalModalOpen(false)} 
        onSubmit={handleSignalSubmit} 
      />
    </div>
  );
}

export default App;