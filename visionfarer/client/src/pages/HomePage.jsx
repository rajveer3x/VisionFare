import React from 'react';
import SearchForm from '../components/SearchForm';
import { Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-darkBase flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Radar Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-slate-800 rounded-full opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] border border-cyan-900/40 rounded-full opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] md:w-[200px] md:h-[200px] border border-cyan-700/50 rounded-full opacity-50 relative pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[50px] md:w-[100px] h-0.5 bg-gradient-to-r from-transparent to-cyan-500 origin-left animate-[spin_3s_linear_infinite]"></div>
      </div>
      
      <div className="z-10 w-full max-w-4xl flex flex-col items-center space-y-10 mt-8">
        <div className="text-center space-y-3 relative">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-2 md:mb-4">
             <Activity className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-[0.2em] text-white">VISION<span className="text-cyan-400">FARE</span></h1>
          </div>
          <p className="font-display uppercase tracking-[0.3em] text-slate-500 text-xs md:text-sm shadow-xl drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">Global Transit Intelligence Engine</p>
        </div>
        
        <div className="w-full">
           <SearchForm />
        </div>
      </div>
    </div>
  );
}
