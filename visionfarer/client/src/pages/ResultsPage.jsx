import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import SearchForm from '../components/SearchForm';
import ResultCard from '../components/ResultCard';
import LoadingState from '../components/LoadingState';

export default function ResultsPage() {
  const location = useLocation();
  // We strictly use the state passed from the router history initially
  const query = location.state?.query || null;

  const fetchResults = async () => {
    if (!query) return null;
    const { data } = await api.post('/search', query);
    return data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['searchResults', query],
    queryFn: fetchResults,
    enabled: !!query,
    refetchOnWindowFocus: false,
    retry: 1
  });

  return (
    <div className="min-h-screen bg-darkBase p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
           <Link to="/" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 font-display text-sm tracking-widest uppercase transition-colors group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Home Terminal
           </Link>
           <h1 className="text-lg md:text-xl font-display tracking-[0.2em] text-white uppercase"><span className="text-slate-500">Scan /</span> Results</h1>
        </div>

        {/* Search Parameter Context Box */}
        <div className="opacity-95 hover:opacity-100 transition-opacity">
          <SearchForm initialQuery={query} />
        </div>

        {/* Main Content Area */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between text-slate-400 font-display text-xs uppercase tracking-widest border-l-2 border-cyan-500 pl-3 py-1">
             <span>Network Scan Output</span>
             {data?.topResults && <span>{data.count} exact hits</span>}
          </div>

          {!query && (
             <div className="p-8 text-center text-slate-500 font-display uppercase tracking-widest border border-slate-800 rounded flex flex-col items-center gap-3">
               <AlertTriangle className="w-6 h-6 text-amber-500/50" />
               Awaiting search parameters to initiate scan.
             </div>
          )}

          {isLoading && query && <LoadingState />}

          {isError && (
            <div className="bg-red-950/20 border border-red-900 rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-red-500 font-display text-sm text-center">
               <AlertTriangle className="w-10 h-10 shadow-lg text-red-500" />
               <h3 className="uppercase tracking-widest text-lg font-bold">Network Request Failed</h3>
               <p className="text-xs opacity-80 uppercase font-sans tracking-wide max-w-sm">{error?.response?.data?.message || error.message || "Failed to reach backend infrastructure. Check API mappings."}</p>
               <button onClick={() => refetch()} className="mt-4 text-white bg-red-900/60 shadow-[0_0_15px_-3px_rgba(220,38,38,0.5)] px-6 py-3 hover:bg-red-800 transition-colors uppercase tracking-widest text-xs flex items-center gap-2 rounded">
                 <RefreshCw className="w-3.5 h-3.5" /> Retry Scan Sequence
               </button>
            </div>
          )}

          {data?.success && data.topResults && (
            <div className="space-y-12">
               <div className="space-y-4">
                 <h2 className="text-sm font-display text-cyan-400 tracking-widest uppercase mb-4 flex items-center gap-2.5">
                   <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]"></span>
                   Optimal Trajectories
                 </h2>
                 {data.topResults.map(trip => (
                   <ResultCard key={trip.id} trip={trip} />
                 ))}
               </div>
               
               {data.otherResults && data.otherResults.length > 0 && (
                 <div className="space-y-4 pt-8 border-t border-slate-800">
                    <h2 className="text-xs font-display text-slate-500 tracking-widest uppercase mb-4 pl-1">
                      Alternate / Unanalyzed Options
                    </h2>
                    {data.otherResults.map(trip => (
                      <div key={trip.id} className="opacity-60 saturate-50 hover:saturate-100 hover:opacity-100 transition-all duration-300">
                        <ResultCard trip={trip} />
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
