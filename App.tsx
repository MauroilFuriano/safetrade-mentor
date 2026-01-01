import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, ShieldCheck, AlertTriangle, Zap, XCircle, BookOpen, Key, PlayCircle } from 'lucide-react';
import { ChatBubble } from './components/ChatBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { SignalModal } from './components/SignalModal';
import { VideoTutorialsModal } from './components/VideoTutorialsModal'; // <--- Importato
import { ProgressIndicator } from './components/ProgressIndicator';
import { Message, Role } from './types';
import { sendMessageToGemini, resetChatSession } from './services/geminiService';
import { APP_NAME, SYSTEM_INSTRUCTION_TRADING, SYSTEM_INSTRUCTION_API } from './constants';
import { initTelegram, getUserName, closeApp } from './services/telegramService';

// Definiamo le 3 modalità possibili dell'App
type AppMode = 'SELECTION' | 'TRADING' | 'API_GUIDE';

function App() {
  const [mode, setMode] = useState<AppMode>('SELECTION'); // Parte sempre dal Menu
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Stati per le Modali
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false); // <--- Stato Video
  
  const [currentPhase, setCurrentPhase] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    initTelegram();
  }, []);

  // Funzione che fa partire la sessione
  const startSession = (selectedMode: 'TRADING' | 'API_GUIDE') => {
    setMode(selectedMode);
    resetChatSession();
    setIsVideoModalOpen(false); // Reset modale video
    const userName = getUserName();
    
    let initialMessageContent = "";
    
    // Messaggio di Benvenuto diverso in base alla scelta
    if (selectedMode === 'TRADING') {
      initialMessageContent = `Ciao ${userName}! 👋 Benvenuto nella **SafeTrade Academy**.\n\nOggi sarò il tuo mentore personale. Ti guiderò passo dopo passo nell'apertura di un trade **Risk Free** su Bitget.\n\nNiente rischi reali, solo pratica. Sei pronto a diventare un cecchino dei mercati? 🎯\n\nScrivi "Sono pronto" per iniziare!`;
    } else {
      initialMessageContent = `Ciao ${userName}! 👋 Benvenuto nel supporto configurazione Bot.\n\nTi guiderò passo dopo passo nella creazione delle **Chiavi API su Bitget** in totale sicurezza 🛡️.\n\nAlla fine avrai i dati necessari da inserire nel sito per attivare il tuo Bot Spot.\n\nSei loggato su Bitget? Scrivi "Pronto" per iniziare.`;
    }

    const welcomeMsg: Message = {
      id: 'welcome',
      role: Role.MODEL,
      content: initialMessageContent,
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
  };

  const updatePhaseFromResponse = (text: string) => {
    const phaseMatch = text.match(/\[PHASE:\s*(\d)\]/);
    if (phaseMatch && phaseMatch[1]) {
      const phaseNum = parseInt(phaseMatch[1], 10);
      if (!isNaN(phaseNum) && phaseNum >= 1 && phaseNum <= 4) {
        setCurrentPhase(phaseNum);
      }
    }
  };

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
      // Scegliamo l'istruzione in base alla modalità
      const currentInstruction = mode === 'TRADING' ? SYSTEM_INSTRUCTION_TRADING : SYSTEM_INSTRUCTION_API;

      const aiResponseText = await sendMessageToGemini(textToSend, messages, currentInstruction);
      
      if (mode === 'TRADING') {
        updatePhaseFromResponse(aiResponseText);
      }
      
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
    if (window.confirm("Vuoi tornare al menu principale?")) {
      setMode('SELECTION');
      setMessages([]);
      setCurrentPhase(1);
    }
  };

  const handleSignalSubmit = (data: { pair: string; side: string; entry: string; sl: string; tp: string }) => {
    const signalMessage = `🚨 **SIMULAZIONE SEGNALE RICEVUTO** 🚨\n\n🔹 **Coppia:** ${data.pair}\n🔹 **Lato:** ${data.side === 'LONG' ? 'LONG 🟢' : 'SHORT 🔴'}\n🔹 **Entry:** ${data.entry}\n🔹 **Stop Loss:** ${data.sl}\n🔹 **Take Profit:** ${data.tp}\n\nHo ricevuto questo segnale dal bot. Guidami passo passo nell'inserimento dell'ordine su Bitget.`;
    handleSendMessage(undefined, signalMessage);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-200 font-sans relative overflow-hidden">
      
      {/* Header */}
      <header className="flex-none bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight animate-text-shimmer">{APP_NAME}</h1>
            <p className="text-xs text-emerald-400 font-medium">
                {mode === 'SELECTION' ? 'Scegli il percorso' : (mode === 'TRADING' ? 'Trading Academy' : 'Guida Configurazione Bot')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            
            {/* Bottone Video Tutorial: Appare solo in Trading Mode */}
            {mode === 'TRADING' && (
               <button 
                 onClick={() => setIsVideoModalOpen(true)}
                 className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-full transition-colors"
                 title="Video Tutorial Bitget"
               >
                 <PlayCircle size={24} />
               </button>
            )}

            {mode !== 'SELECTION' && (
                <button 
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                title="Torna al Menu"
                >
                <RefreshCw size={20} />
                </button>
            )}
            <button 
              onClick={closeApp}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition-colors"
              title="Chiudi App"
            >
              <XCircle size={20} />
            </button>
        </div>
      </header>

      {/* Progress Bar (Solo se siamo in Trading Mode) */}
      {mode === 'TRADING' && <ProgressIndicator currentPhase={currentPhase} />}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth pb-44">
        
        {/* VISTA MENU SELEZIONE */}
        {mode === 'SELECTION' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Cosa vuoi fare oggi?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    {/* Card 1: Trading Academy */}
                    <button 
                        onClick={() => startSession('TRADING')}
                        className="group bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-left transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:-translate-y-1"
                    >
                        <div className="bg-emerald-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                            <BookOpen size={28} className="text-emerald-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Impara a Tradare</h3>
                        <p className="text-slate-400 text-sm">
                            Simulazione guidata per aprire trade manuali su Bitget Futures senza rischi.
                        </p>
                    </button>

                    {/* Card 2: API Setup */}
                    <button 
                        onClick={() => startSession('API_GUIDE')}
                        className="group bg-slate-900 border border-slate-700 hover:border-amber-500 rounded-2xl p-6 text-left transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:-translate-y-1"
                    >
                        <div className="bg-amber-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-600 transition-colors">
                            <Key size={28} className="text-amber-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Configura API Bot</h3>
                        <p className="text-slate-400 text-sm">
                            Guida sicura passo-passo per creare le chiavi API su Bitget e attivare il Bot Spot.
                        </p>
                    </button>
                </div>
            </div>
        )}

        {/* VISTA CHAT */}
        {mode !== 'SELECTION' && (
            <div className="p-4 md:p-6 space-y-4">
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
            </div>
        )}
      </main>

      {/* Input Area (Solo se NON siamo nel menu) */}
      {mode !== 'SELECTION' && (
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-3 py-4 z-50 pb-8 md:pb-6 safe-area-padding shadow-2xl w-full">
            <div className="max-w-4xl mx-auto flex gap-2 w-full">
            
            {/* Pulsante Segnale solo in modalità Trading */}
            {mode === 'TRADING' && (
                <button
                    onClick={() => setIsSignalModalOpen(true)}
                    disabled={isLoading}
                    className="flex-shrink-0 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl w-10 h-10 md:w-auto md:px-4 flex items-center justify-center transition-all shadow-lg shadow-amber-900/20 active:scale-95"
                    title="Simula Segnale Bot"
                >
                    <Zap size={20} />
                </button>
            )}

            <form onSubmit={(e) => handleSendMessage(e)} className="flex-1 flex gap-2 min-w-0">
                <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Scrivi..."
                className="flex-1 min-w-0 bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder-slate-500 text-sm md:text-base"
                disabled={isLoading}
                />
                <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 md:px-6 flex items-center justify-center transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
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
      )}

      {/* Modals */}
      <SignalModal 
        isOpen={isSignalModalOpen} 
        onClose={() => setIsSignalModalOpen(false)} 
        onSubmit={handleSignalSubmit} 
      />
      <VideoTutorialsModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}

export default App;