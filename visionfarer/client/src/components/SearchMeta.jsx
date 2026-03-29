import React from 'react';
import { Zap, Activity } from 'lucide-react';

export default function SearchMeta({ count, origin, destination, travelDate, source }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-5 bg-slate-900 border border-slate-800 rounded-lg shadow-lg mb-6">
      <h2 className="text-slate-300 font-display text-xs md:text-sm uppercase tracking-widest">
        Showing {count} results for <span className="text-white font-bold">{origin}</span> → <span className="text-white font-bold">{destination}</span> on <span className="text-white font-bold">{travelDate}</span>
      </h2>
      
      {source === 'cache' ? (
        <div className="flex items-center gap-2 text-cyan-400 bg-cyan-900/30 border border-cyan-500/30 px-3 py-1.5 rounded text-[10px] md:text-xs font-display uppercase tracking-widest font-bold">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          ⚡ Instant results (cached)
        </div>
      ) : (
        <div className="flex items-center gap-2 text-rose-400 bg-rose-900/30 border border-rose-500/30 px-3 py-1.5 rounded text-[10px] md:text-xs font-display uppercase tracking-widest font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse text-rose-500" />
          🔴 Live prices
        </div>
      )}
    </div>
  );
}
