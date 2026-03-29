import React from 'react';

export default function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-5 relative overflow-hidden shadow-lg">
           <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent z-10"></div>
           
           <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1 space-y-5">
                <div className="flex justify-between">
                   <div className="h-3 w-32 bg-slate-800/80 rounded animate-pulse"></div>
                   <div className="h-6 w-24 border border-slate-800 bg-slate-800/50 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center pr-4">
                   <div className="h-8 w-24 bg-slate-800 rounded animate-pulse"></div>
                   <div className="flex-1 h-px bg-slate-800 mx-6"></div>
                   <div className="h-8 w-24 bg-slate-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-4 flex flex-col items-start md:items-end">
                <div className="h-8 w-32 bg-slate-800 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-slate-800/80 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-slate-800/50 rounded animate-pulse"></div>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}
