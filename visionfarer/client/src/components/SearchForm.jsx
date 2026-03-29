import React, { useState } from 'react';
import { Search, PlaneTakeoff, Bus, TrainFront } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchForm({ initialQuery }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialQuery || {
    origin: '',
    destination: '',
    travelDate: new Date().toISOString().split('T')[0],
    transportType: 'flight'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/search', { state: { query: formData } });
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-lg shadow-2xl relative overflow-hidden ring-1 ring-inset ring-slate-800">
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/70"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          {[
            { id: 'flight', icon: <PlaneTakeoff className="w-4 h-4" /> },
            { id: 'bus', icon: <Bus className="w-4 h-4" /> },
            { id: 'train', icon: <TrainFront className="w-4 h-4" /> }
          ].map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({ ...formData, transportType: type.id })}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded transition-all duration-300 font-display uppercase tracking-widest text-xs font-semibold ${
                formData.transportType === type.id 
                  ? 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]' 
                  : 'bg-slate-950/50 border border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {type.icon}
              {type.id}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <div className="space-y-2">
             <label className="text-[10px] md:text-xs font-display text-slate-500 uppercase tracking-widest pl-1">Origin Code</label>
             <input 
               required
               type="text" 
               placeholder="DEB"
               className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none rounded p-3.5 text-white placeholder-slate-700 transition-all uppercase font-display text-lg tracking-widest"
               value={formData.origin}
               onChange={e => setFormData({...formData, origin: e.target.value.toUpperCase()})}
               minLength={2}
               maxLength={100}
             />
          </div>
          
          <div className="space-y-2">
             <label className="text-[10px] md:text-xs font-display text-slate-500 uppercase tracking-widest pl-1">Target Node</label>
             <input 
               required
               type="text" 
               placeholder="JFK"
               className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none rounded p-3.5 text-white placeholder-slate-700 transition-all uppercase font-display text-lg tracking-widest"
               value={formData.destination}
               onChange={e => setFormData({...formData, destination: e.target.value.toUpperCase()})}
               minLength={2}
               maxLength={100}
             />
          </div>
          
          <div className="space-y-2">
             <label className="text-[10px] md:text-xs font-display text-slate-500 uppercase tracking-widest pl-1">System Time</label>
             <input 
               required
               type="date" 
               min={new Date().toISOString().split('T')[0]}
               className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none rounded p-3.5 text-slate-300 font-display transition-all [color-scheme:dark] flex-1"
               value={formData.travelDate}
               onChange={e => setFormData({...formData, travelDate: e.target.value})}
             />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 mt-2 bg-slate-800 hover:bg-cyan-600 text-cyan-500 hover:text-white font-display uppercase tracking-widest text-sm rounded transition-all duration-300 border border-cyan-500/30 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 font-semibold group outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
           <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
           Scan Networks
        </button>
      </form>
    </div>
  );
}
