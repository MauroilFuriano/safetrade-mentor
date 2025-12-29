import React, { useState } from 'react';
import { X, Play, Clock, ArrowLeft, Layout, Settings, List, TrendingUp } from 'lucide-react';

interface Tutorial {
  id: number;
  title: string;
  duration: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const TUTORIALS: Tutorial[] = [
  {
    id: 1,
    title: "Panoramica Interfaccia Futures",
    duration: "2:15",
    description: "Impara a navigare nella dashboard di OKX. Scopri dove trovare il grafico, il saldo del portafoglio 'Trading' e il pannello di controllo ordini.",
    icon: <Layout size={24} />,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Impostare Leva e Margine",
    duration: "1:45",
    description: "Fondamentale: Leva alta = Liquidazione rapida. Impara a impostare 'Isolato' (Isolated) e Leva max 5x per evitare che una piccola oscillazione bruci il capitale.",
    icon: <Settings size={24} />,
    color: "bg-purple-500"
  },
  {
    id: 3,
    title: "Lettura dell'Order Book",
    duration: "3:00",
    description: "Capire la liquidità: come leggere gli ordini di acquisto (verdi) e vendita (rossi) su OKX per decidere il miglior prezzo di entrata.",
    icon: <List size={24} />,
    color: "bg-amber-500"
  },
  {
    id: 4,
    title: "Inserimento Ordine Limit",
    duration: "2:30",
    description: "Guida pratica all'apertura di un trade: impostazione del prezzo, quantità e inserimento contestuale di Stop Loss e Take Profit nella scheda ordine.",
    icon: <TrendingUp size={24} />,
    color: "bg-emerald-500"
  }
];

interface VideoTutorialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTutorialsModal: React.FC<VideoTutorialsModalProps> = ({ isOpen, onClose }) => {
  const [activeVideo, setActiveVideo] = useState<Tutorial | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-message-slide-in">
        
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700 flex-none">
          <div className="flex items-center gap-3">
             {activeVideo && (
                <button 
                  onClick={() => setActiveVideo(null)}
                  className="mr-2 p-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
             )}
             <h3 className="text-white font-bold text-lg flex items-center gap-2">
               {activeVideo ? activeVideo.title : 'Tutorial Piattaforma OKX'}
             </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
            
            {activeVideo ? (
                // PLAYER VIEW
                <div className="flex flex-col h-full gap-6">
                    <div className="w-full aspect-video bg-black rounded-xl border border-slate-800 relative group overflow-hidden flex items-center justify-center shadow-lg">
                        {/* Fake Video Player UI */}
                        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center">
                             <div className={`p-6 rounded-full ${activeVideo.color} bg-opacity-20 mb-4 animate-pulse`}>
                                {/* MODIFICA QUI SOTTO: cast "as any" per risolvere l'errore TS su "size" */}
                                {React.cloneElement(activeVideo.icon as any, { size: 48, className: "text-white opacity-80" })}
                             </div>
                             <p className="text-slate-500 text-sm font-mono">Video Simulazione: {activeVideo.title}</p>
                        </div>
                        
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <div className="bg-emerald-600 rounded-full p-4 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                                <Play size={32} className="text-white fill-current ml-1" />
                            </div>
                        </div>

                        {/* Fake Controls */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/90 to-transparent flex items-end px-4 pb-3 gap-4">
                            <div className="text-white/90 cursor-pointer"><Play size={16} fill="white"/></div>
                            <div className="flex-1 h-1 bg-slate-600 rounded-full overflow-hidden relative top-[-6px]">
                                <div className="w-1/3 h-full bg-emerald-500"></div>
                            </div>
                            <div className="text-xs text-slate-300 font-mono">00:45 / {activeVideo.duration}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">{activeVideo.title}</h2>
                                <p className="text-slate-400 leading-relaxed max-w-2xl">{activeVideo.description}</p>
                            </div>
                            <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-2">
                                <Clock size={14} className="text-emerald-400"/>
                                <span className="text-xs font-mono text-slate-300">{activeVideo.duration}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // LIBRARY GRID VIEW
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TUTORIALS.map((video) => (
                        <button
                            key={video.id}
                            onClick={() => setActiveVideo(video)}
                            className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 text-left transition-all duration-300 flex items-start gap-4 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1"
                        >
                            {/* Thumbnail */}
                            <div className={`w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-lg ${video.color} bg-opacity-20 flex items-center justify-center border border-white/5 group-hover:border-emerald-500/30 transition-colors`}>
                                <div className="text-white/80 group-hover:text-white transition-colors transform group-hover:scale-110 duration-300">
                                    {video.icon}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 py-1">
                                <h4 className="text-white font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
                                    {video.title}
                                </h4>
                                <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">
                                    {video.description}
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="bg-black/30 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono flex items-center gap-1">
                                        <Clock size={10} /> {video.duration}
                                    </div>
                                    <span className="text-[10px] text-emerald-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Guarda ora &rarr;
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};