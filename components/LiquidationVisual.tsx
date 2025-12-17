import React, { useEffect, useState } from 'react';

export const LiquidationVisual: React.FC = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distanza dalla Liquidazione</h4>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">Quanto può scendere il prezzo?</span>
      </div>
      
      {/* 20x High Risk Scenario */}
      <div className="mb-5 relative">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-red-400 font-bold flex items-center gap-1">
            Leva 20x 
            <span className="hidden sm:inline text-[10px] font-normal text-red-400/70">(Alto Rischio)</span>
          </span>
          <span className="text-red-400 font-mono font-bold">5% Spazio</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
            {/* Background markers for context */}
            <div className="absolute left-[25%] top-0 bottom-0 w-px bg-slate-700/50"></div>
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-slate-700/50"></div>
            <div className="absolute left-[75%] top-0 bottom-0 w-px bg-slate-700/50"></div>
            
            <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                style={{ width: animate ? '25%' : '0%' }}
            ></div>
        </div>
        <div className="absolute right-0 top-6 text-[10px] text-red-500/60 font-medium">⚠️ Liquidazione vicinissima</div>
      </div>

       {/* 5x Safe Scenario */}
      <div className="relative">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            Leva 5x 
            <span className="hidden sm:inline text-[10px] font-normal text-emerald-400/70">(Consigliata)</span>
          </span>
          <span className="text-emerald-400 font-mono font-bold">20% Spazio</span>
        </div>
         <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
            {/* Background markers for context */}
            <div className="absolute left-[25%] top-0 bottom-0 w-px bg-slate-700/50"></div>
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-slate-700/50"></div>
            <div className="absolute left-[75%] top-0 bottom-0 w-px bg-slate-700/50"></div>

            <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out delay-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                style={{ width: animate ? '100%' : '0%' }}
            ></div>
        </div>
        <div className="absolute right-0 top-6 text-[10px] text-emerald-500/60 font-medium">🛡️ Ampio margine di sicurezza</div>
      </div>
      
      <div className="mt-8 pt-3 border-t border-slate-700/50 text-[10px] text-slate-400 leading-tight">
        <span className="font-bold text-slate-300">Ricorda:</span> La Leva 20x moltiplica i profitti, ma riduce il tuo "ossigeno" a un quarto rispetto alla Leva 5x.
      </div>
    </div>
  );
};