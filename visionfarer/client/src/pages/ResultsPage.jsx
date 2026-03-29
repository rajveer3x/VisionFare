import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import ResultCard from '../components/ResultCard';
import LoadingState from '../components/LoadingState';
import SearchMeta from '../components/SearchMeta';
import ErrorState from '../components/ErrorState';
import { useSearchRoutes } from '../hooks/useSearchRoutes';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query || null;
  // Fallback to pre-fetched data if provided directly via SearchForm navigation State
  const initialResultsData = location.state?.resultsData || null;

  const { mutate: searchRoutes, data: hookData, isLoading, isError, error } = useSearchRoutes();

  // Prefer aggressively pushed results from SearchForm, otherwise trust the mutation state
  const data = initialResultsData || hookData;

  useEffect(() => {
    // If the user navigates here via direct link or refresh without state, kick them back
    // However, if they have query state but NO results yet (e.g. they refreshed manually but browser kept state),
    // trigger the mutation natively to recover seamlessly.
    if (query && !data && !isLoading && !isError) {
      searchRoutes(query);
    }
  }, [query, data, isLoading, isError, searchRoutes]);

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
          {!query && (
             <div className="p-8 text-center text-slate-500 font-display uppercase tracking-widest border border-slate-800 rounded flex flex-col items-center gap-3">
               <AlertTriangle className="w-6 h-6 text-amber-500/50" />
               Awaiting search parameters to initiate scan.
             </div>
          )}

          {isLoading && query && <LoadingState />}

          {isError && (
             <ErrorState 
               error={error} 
               onRetry={() => searchRoutes(query)} 
             />
          )}

          {data?.success && data.topResults && (
            <div className="space-y-8">
               
               <SearchMeta 
                 count={data.count} 
                 origin={query.origin} 
                 destination={query.destination} 
                 travelDate={query.travelDate} 
                 source={data.source} 
               />

               <div className="space-y-4">
                 <h2 className="text-sm font-display text-cyan-400 tracking-widest uppercase mb-4 flex items-center gap-2.5">
                   <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]"></span>
                   Optimal Trajectories
                 </h2>
                 {data.topResults.map(trip => (
                   <div key={trip.externalId || trip.id}>
                     <ResultCard trip={trip} />
                   </div>
                 ))}
               </div>
               
               {data.otherResults && data.otherResults.length > 0 && (
                 <div className="space-y-4 pt-10 border-t border-slate-800 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-darkBase px-4 text-xs font-display text-slate-500 tracking-widest uppercase">
                      More Options
                    </div>
                    
                    {data.otherResults.map(trip => (
                      <div key={trip.externalId || trip.id} className="opacity-60 saturate-50 hover:saturate-100 hover:opacity-100 transition-all duration-300">
                        {/* Wipe badges for remaining options safely mapping to default nulls/UNDEFINED expectations */}
                        <ResultCard trip={{ ...trip, aiRecommendation: 'NOT_ANALYZED', aiConfidence: null }} />
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
