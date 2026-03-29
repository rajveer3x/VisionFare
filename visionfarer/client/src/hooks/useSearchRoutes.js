import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * Hook bridging the frontend UI to the unified live external-API backend via React Query.
 * Provides caching resilience and handles network errors seamlessly.
 */
export const useSearchRoutes = () => {
  return useMutation({
    mutationFn: async (searchData) => {
      // POST mapping precisely to our newly unified search controller
      const response = await api.post('/search', searchData);
      return response.data;
    },
    onError: (error) => {
      // De-structures specific validation logic errors vs broad network failures
      const msg = error.response?.data?.message || 'Failed to search live routes. The external aggregator may be congested.';
      toast.error(msg);
    }
  });
};
