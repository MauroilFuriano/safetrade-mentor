import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Target, AlertOctagon, DollarSign } from 'lucide-react';

interface SignalData {
  pair: string;
  side: 'LONG' | 'SHORT';
  entry: string;
  sl: string;
  tp: string;
}

interface SignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SignalData) => void;
}

export const SignalModal: React.FC<SignalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [pair, setPair] = useState('BTC/USDT');
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [entry, setEntry] = useState('');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry || !sl || !tp) return;
    onSubmit({ pair, side, entry, sl, tp });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-message-slide-in">
        
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Simula Segnale Bot
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Pair & Side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium ml-1">Pair</label>
              <input 
                type="text" 
                value={pair}
                onChange={(e) => setPair(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium ml-1">Direzione</label>
              <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setSide('LONG')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    side === 'LONG' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-emerald-500'
                  }`}
                >
                  <TrendingUp size={14} /> Long
                </button>
                <button
                  type="button"
                  onClick={() => setSide('SHORT')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    side === 'SHORT' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-red-500'
                  }`}
                >
                  <TrendingDown size={14} /> Short
                </button>
              </div>
            </div>
          </div>

          {/* Entry Price */}
          <div className="space-y-1">
            <label className="text-xs text-emerald-400 font-medium ml-1 flex items-center gap-1">
              <DollarSign size={10} /> Entry Price
            </label>
            <input 
              type="number" 
              placeholder="es. 65000"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* SL & TP */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-red-400 font-medium ml-1 flex items-center gap-1">
                <AlertOctagon size={10} /> Stop Loss
              </label>
              <input 
                type="number" 
                placeholder="es. 64000"
                value={sl}
                onChange={(e) => setSl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-emerald-400 font-medium ml-1 flex items-center gap-1">
                <Target size={10} /> Take Profit
              </label>
              <input 
                type="number" 
                placeholder="es. 67000"
                value={tp}
                onChange={(e) => setTp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
             Genera Segnale
          </button>

        </form>
      </div>
    </div>
  );
};