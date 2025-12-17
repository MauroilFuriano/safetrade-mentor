import React from 'react';
import { UserPlus, Shield, TrendingUp, Award } from 'lucide-react';

interface ProgressIndicatorProps {
  currentPhase: number;
}

const STEPS = [
  { id: 1, label: 'Setup', icon: UserPlus },
  { id: 2, label: 'Sicurezza', icon: Shield },
  { id: 3, label: 'Ordine', icon: TrendingUp },
  { id: 4, label: 'Gestione', icon: Award },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentPhase }) => {
  // Calculate progress percentage for the connecting line (background)
  const progressPercentage = ((currentPhase - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 py-3 px-6 sticky top-0 z-20">
      <div className="max-w-md mx-auto relative">
        
        {/* Connecting Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 rounded-full" />
        
        {/* Connecting Line Active */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />

        <div className="relative flex justify-between w-full">
          {STEPS.map((step) => {
            const isActive = step.id <= currentPhase;
            const isCurrent = step.id === currentPhase;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5 group">
                {/* Circle Indicator */}
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10
                    ${isActive 
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                    }
                    ${isCurrent ? 'scale-110 ring-4 ring-emerald-500/20' : ''}
                  `}
                >
                  <step.icon size={14} className={isActive ? 'animate-pulse-once' : ''} />
                </div>
                
                {/* Label */}
                <span 
                  className={`
                    text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 absolute -bottom-5 w-20 text-center
                    ${isActive ? 'text-emerald-400' : 'text-slate-600'}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-4"></div> {/* Spacer for absolute labels */}
    </div>
  );
};