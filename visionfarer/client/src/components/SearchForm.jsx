import React, { useState } from 'react';
import { Search, PlaneTakeoff, Bus, TrainFront, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchRoutes } from '../hooks/useSearchRoutes';

export default function SearchForm({ initialQuery }) {
  const navigate = useNavigate();
  const { mutate: searchRoutes, isLoading: isSearching } = useSearchRoutes();
  
  const [formData, setFormData] = useState(initialQuery || {
    origin: '',
    destination: '',
    travelDate: new Date().toISOString().split('T')[0],
    transportType: 'flight'
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const todayStr = new Date().toISOString().split('T')[0];

    if (!formData.origin.trim()) errors.origin = "Origin is required.";
    if (!formData.destination.trim()) errors.destination = "Destination is required.";
    
    if (formData.origin.trim() && formData.destination.trim()) {
      if (formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
        errors.destination = "Origin and destination cannot be the same.";
      }
    }

    if (!formData.travelDate) {
      errors.travelDate = "Travel date is required.";
    } else if (new Date(formData.travelDate) < new Date(todayStr)) {
      errors.travelDate = "Travel date cannot be in the past.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    searchRoutes(formData, {
      onSuccess: (data) => {
        // Upon successful live fetch, forward everything securely to the result dashboard
        navigate('/search', { state: { query: formData, resultsData: data } });
      }
    });
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
               type="text" 
               placeholder="DEB"
               className={`w-full bg-slate-950/80 border ${formErrors.origin ? 'border-red-500/50' : 'border-slate-800 focus:border-cyan-500/50'} outline-none rounded p-3.5 text-white placeholder-slate-700 transition-all uppercase font-display text-lg tracking-widest`}
               value={formData.origin}
               onChange={e => {
                 setFormData({...formData, origin: e.target.value.toUpperCase()});
                 if (formErrors.origin) setFormErrors({...formErrors, origin: null});
               }}
             />
             {formErrors.origin && <p className="text-red-500/80 text-[10px] uppercase font-display px-1">{formErrors.origin}</p>}
          </div>
          
          <div className="space-y-2">
             <label className="text-[10px] md:text-xs font-display text-slate-500 uppercase tracking-widest pl-1">Target Node</label>
             <input 
               type="text" 
               placeholder="JFK"
               className={`w-full bg-slate-950/80 border ${formErrors.destination ? 'border-red-500/50' : 'border-slate-800 focus:border-cyan-500/50'} outline-none rounded p-3.5 text-white placeholder-slate-700 transition-all uppercase font-display text-lg tracking-widest`}
               value={formData.destination}
               onChange={e => {
                 setFormData({...formData, destination: e.target.value.toUpperCase()});
                 if (formErrors.destination) setFormErrors({...formErrors, destination: null});
               }}
             />
             {formErrors.destination && <p className="text-red-500/80 text-[10px] uppercase font-display px-1">{formErrors.destination}</p>}
          </div>
          
          <div className="space-y-2">
             <label className="text-[10px] md:text-xs font-display text-slate-500 uppercase tracking-widest pl-1">System Time</label>
             <input 
               type="date" 
               min={new Date().toISOString().split('T')[0]}
               className={`w-full bg-slate-950/80 border ${formErrors.travelDate ? 'border-red-500/50' : 'border-slate-800 focus:border-cyan-500/50'} outline-none rounded p-3.5 text-slate-300 font-display transition-all [color-scheme:dark] flex-1`}
               value={formData.travelDate}
               onChange={e => {
                 setFormData({...formData, travelDate: e.target.value});
                 if (formErrors.travelDate) setFormErrors({...formErrors, travelDate: null});
               }}
             />
             {formErrors.travelDate && <p className="text-red-500/80 text-[10px] uppercase font-display px-1">{formErrors.travelDate}</p>}
          </div>
        </div>

        <div className="pt-2 flex flex-col items-center">
          <button 
            type="submit"
            disabled={isSearching}
            className="w-full py-4 bg-slate-800 hover:bg-cyan-600 disabled:opacity-50 disabled:hover:bg-slate-800 text-cyan-500 disabled:text-cyan-700 hover:text-white font-display uppercase tracking-widest text-sm rounded transition-all duration-300 border border-cyan-500/30 disabled:border-slate-700 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] disabled:hover:shadow-none flex items-center justify-center gap-3 font-semibold group outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
             {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
             ) : (
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
             )}
             {isSearching ? 'Connecting...' : 'Scan Networks'}
          </button>
          
          {isSearching && (
             <p className="text-[10px] text-cyan-500/70 font-display uppercase tracking-widest mt-3 animate-pulse">
               Searching real-time nodes...
             </p>
          )}
        </div>
      </form>
    </div>
  );
}
