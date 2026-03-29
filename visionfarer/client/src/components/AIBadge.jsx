import React from 'react';
import { Loader2, CheckCircle, Clock } from 'lucide-react';

export default function AIBadge({ recommendation, confidence }) {
  if (recommendation === 'NOT_ANALYZED') return null;

  const confText = confidence !== null && confidence !== undefined 
    ? ` · ${Math.round(confidence * 100)}%` 
    : '';

  if (recommendation === 'BUY_NOW') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm border border-green-500 bg-green-500 text-white font-display text-xs font-bold uppercase tracking-widest relative overflow-hidden">
        <div className="absolute inset-0 ring-2 ring-green-400 animate-ping opacity-20"></div>
        <CheckCircle className="w-3.5 h-3.5 relative z-10" />
        <span className="relative z-10">BUY NOW{confText}</span>
      </div>
    );
  }
  
  if (recommendation === 'WAIT') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm border border-amber-500 bg-amber-500 text-white font-display text-xs font-bold uppercase tracking-widest">
         <Clock className="w-3.5 h-3.5" />
         <span>WAIT{confText}</span>
      </div>
    );
  }
  
  // PENDING state
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm border border-slate-700 bg-slate-600 text-slate-300 font-display text-xs font-bold uppercase tracking-widest">
      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />
      <span>Analyzing...</span>
    </div>
  );
}
