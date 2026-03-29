import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  const getErrorMessage = () => {
    if (!error) return "Something went wrong. Please try again.";
    
    const status = error?.response?.status;
    if (status === 429) return "Too many searches. Please wait a moment.";
    if (status === 502 || status === 504) return "Live prices are temporarily unavailable. Try again in a few seconds.";
    if (status === 404) return "No routes found for this search. Try different dates or cities.";
    
    return error?.response?.data?.message || error.message || "Something went wrong. Please try again.";
  };

  return (
    <div className="bg-red-950/20 border border-red-900 rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-red-500 font-display text-sm text-center shadow-lg">
      <AlertTriangle className="w-10 h-10 shadow-lg text-red-500" />
      <h3 className="uppercase tracking-widest text-lg font-bold">Network Request Failed</h3>
      <p className="text-xs opacity-80 uppercase font-sans tracking-wide max-w-sm">
        {getErrorMessage()}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="mt-4 text-white bg-red-900/60 shadow-[0_0_15px_-3px_rgba(220,38,38,0.5)] px-6 py-3 hover:bg-red-800 transition-colors uppercase tracking-widest text-xs flex items-center gap-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try Again
        </button>
      )}
    </div>
  );
}
