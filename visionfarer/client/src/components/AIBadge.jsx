import React from 'react';
import { Loader2, CheckCircle, Clock } from 'lucide-react';

export default function AIBadge({ recommendation }) {
  if (recommendation === 'NOT_ANALYZED') {
    return null;
  }
  
  if (recommendation === 'BUY_NOW') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm border border-green-500 bg-green-900/30 text-green-400 font-display text-xs font-bold uppercase tracking-widest relative overflow-hidden">
        <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>
        <CheckCircle className="w-3.5 h-3.5 relative z-10" />
        <span className="relative z-10">Buy Now</span>
      </div>
    );
  }
  
  if (recommendation === 'WAIT') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm border border-amber-500 bg-amber-900/30 text-amber-500 font-display text-xs font-bold uppercase tracking-widest relative overflow-hidden">
         <div className="absolute inset-0 bg-amber-500/20 animate-pulse"></div>
         <Clock className="w-3.5 h-3.5 relative z-10" />
         <span className="relative z-10">Wait</span>
      </div>
    );
  }
  
  // PENDING state
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm border border-slate-700 bg-slate-800/80 text-slate-400 font-display text-xs font-bold uppercase tracking-widest">
      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-500" />
      <span>Analyzing</span>
    </div>
  );
}
