import React from 'react';
import { Clock, Users, PlaneTakeoff, Bus, TrainFront, Save } from 'lucide-react';
import AIBadge from './AIBadge';

export default function ResultCard({ trip }) {
  // Operator name + transport icon
  const getIcon = () => {
    switch (trip.transportType) {
      case 'bus': return <Bus className="w-4 h-4 text-cyan-500/70" />;
      case 'train': return <TrainFront className="w-4 h-4 text-cyan-500/70" />;
      default: return <PlaneTakeoff className="w-4 h-4 text-cyan-500/70" />;
    }
  };

  // Human friendly Indian price format: e.g. "₹ 1,200"
  const formattedPrice = trip.price.toLocaleString('en-IN');
  
  // Format dates explicitly separating out just the time (e.g., "11:00 AM")
  const extractTime = (isoString) => {
    if (!isoString) return '--:--';
    // If it's already a short string like "11:00 AM", return it
    if (isoString.includes('AM') || isoString.includes('PM')) return isoString;
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getSeatsColor = () => {
    if (trip.availableSeats === null) return 'text-slate-500';
    return trip.availableSeats < 10 ? 'text-amber-500' : 'text-slate-500';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-cyan-500/40 transition-colors shadow-lg relative overflow-hidden group">
      
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-600 to-transparent opacity-20 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex-1 space-y-3 pl-2 w-full md:w-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-slate-400 font-display text-xs tracking-widest uppercase truncate">
              {trip.operatorName}
            </span>
          </div>
          <AIBadge recommendation={trip.aiRecommendation} confidence={trip.aiConfidence} />
        </div>
        
        <div className="flex items-center gap-4 md:gap-8 w-full">
          <div className="flex flex-col text-left min-w-[80px]">
            <span className="text-xl md:text-2xl font-display font-bold text-white tracking-widest">
              {extractTime(trip.departureTime)}
            </span>
            <span className="text-[10px] md:text-xs text-slate-500 uppercase font-display mt-1 tracking-widest">Departure</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative min-w-[80px]">
             <div className="w-full h-px bg-slate-700/50 absolute left-0 right-0 top-1/2 -translate-y-1/2"></div>
             <div className="bg-slate-900 px-2 md:px-3 z-10 flex flex-col items-center">
               <Clock className="w-3.5 h-3.5 text-cyan-500 mb-1" />
               <span className="text-[10px] md:text-xs text-slate-300 font-display font-semibold">{trip.duration}</span>
             </div>
          </div>
          
          <div className="flex flex-col text-right min-w-[80px]">
             <span className="text-xl md:text-2xl font-display font-bold text-slate-300 tracking-widest">
                {extractTime(trip.arrivalTime)}
             </span>
             <span className="text-[10px] md:text-xs text-slate-500 uppercase font-display mt-1 tracking-widest">Arrival</span>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 py-1 flex flex-row md:flex-col items-center md:items-end justify-between gap-3 relative">
        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
          <span className="text-2xl md:text-3xl font-display font-bold text-cyan-400">₹{formattedPrice}</span>
          {trip.availableSeats !== null && (
            <div className={`flex items-center gap-1.5 text-xs mt-1 ${getSeatsColor()}`}>
               <Users className="w-3.5 h-3.5" />
               <span className="font-display font-semibold">{trip.availableSeats} seats left</span>
            </div>
          )}
        </div>
        
        {/* Tooltip wrapper for disabled button */}
        <div className="relative group shrink-0" title="Login to save">
          <button 
            disabled 
            className="px-4 py-2 bg-slate-800/50 disabled:opacity-60 text-slate-400 font-display uppercase tracking-widest text-[10px] border border-slate-800 rounded flex items-center gap-2"
          >
            <Save className="w-3 h-3" />
            Save Route
          </button>
        </div>
      </div>
    </div>
  );
}
