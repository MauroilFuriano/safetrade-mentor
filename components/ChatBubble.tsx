import React, { useMemo } from 'react';
import { Message, Role } from '../types';
import { Bot, User, CheckCircle2, Shield, TrendingUp, AlertOctagon, Target, Lock } from 'lucide-react';
import { LiquidationVisual } from './LiquidationVisual';

interface ChatBubbleProps {
  message: Message;
}

const TAG_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'ISOLATED': { 
    label: 'Margin Isolated Attivo', 
    icon: <Lock size={14} />, 
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
  },
  'LEVERAGE': { 
    label: 'Leva 5x Impostata', 
    icon: <Shield size={14} />, 
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
  },
  'STOP_LOSS': { 
    label: 'Stop Loss Inserito', 
    icon: <AlertOctagon size={14} />, 
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
  },
  'TAKE_PROFIT': { 
    label: 'Take Profit Inserito', 
    icon: <Target size={14} />, 
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
  },
  'ORDER_PLACED': { 
    label: 'Ordine Aperto', 
    icon: <CheckCircle2 size={14} />, 
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
  },
  'PARTIAL_CLOSE': { 
    label: 'Profitti Parziali Incassati', 
    icon: <TrendingUp size={14} />, 
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
  },
  'BREAK_EVEN': { 
    label: 'Stop Loss a Break Even', 
    icon: <Shield size={14} />, 
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/50' 
  },
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const { cleanContent, tags, showLiquidationVisual } = useMemo(() => {
    let content = message.content;
    const tagsFound: string[] = [];
    let showVisual = false;

    // Check for visual tag specific for liquidation risk
    if (content.includes('[VISUAL: LIQUIDATION_RISK]')) {
      showVisual = true;
      content = content.replace('[VISUAL: LIQUIDATION_RISK]', '');
    }

    // Remove Phase tags if present (handled in App.tsx for state, cleaned here for display)
    content = content.replace(/\[PHASE:\s*\d\]/g, '');

    // Process standard tags
    content = content.replace(/\[CONFIRMED: ([A-Z_]+)\]/g, (match, tag) => {
      if (TAG_CONFIG[tag]) {
        tagsFound.push(tag);
      }
      return '';
    }).trim();

    return { cleanContent: content, tags: tagsFound, showLiquidationVisual: showVisual };
  }, [message.content]);

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-message-slide-in`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-col items-start'} gap-2`}>
        
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 w-full`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-lg animate-avatar-pop ${
            isUser ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}>
            {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>

            {/* Bubble Content */}
            <div className={`relative px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-md transition-all duration-300 hover:shadow-lg ${
            isUser 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
            <div className="whitespace-pre-wrap font-medium">
                {cleanContent}
            </div>

            {/* In-Bubble Visuals */}
            {!isUser && showLiquidationVisual && (
              <LiquidationVisual />
            )}

            <div className={`text-[10px] mt-1 opacity-60 ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            </div>
        </div>

        {/* Confirmation Badges */}
        {!isUser && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 ml-10 mt-1">
            {tags.map((tag, index) => (
              <div 
                key={tag}
                style={{ animationDelay: `${0.3 + (index * 0.1)}s` }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-sm ${TAG_CONFIG[tag].color} animate-badge-appear`}
              >
                {TAG_CONFIG[tag].icon}
                <span>{TAG_CONFIG[tag].label}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};