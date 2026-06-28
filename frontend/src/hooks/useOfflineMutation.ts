/**
 * useOfflineMutation Hook
 * Queues mutations when offline and syncs when online
 */

import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useOnlineStatus } from './useOnlineStatus';
import { queueMutation, QueuedMutation } from '../lib/offline/storage';
import { useState, useEffect } from 'react';

interface OfflineMutationOptions<TData, TError, TVariables> 
  extends UseMutationOptions<TData, TError, TVariables> {
  offlineMessage?: string;
}

export function useOfflineMutation<TData = unknown, TError = unknown, TVariables = unknown>(
  options: OfflineMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> & { isOnline: boolean } {
  const isOnline = useOnlineStatus();
  const [queuedCount, setQueuedCount] = useState(0);

  const mutation = useMutation<TData, TError, TVariables>({
    ...options,
    mutationFn: async (variables: TVariables) => {
      if (!isOnline) {
        // Queue mutation for later
        const mutationKey = options.mutationKey || ['offline-mutation'];
        await queueMutation({
          mutationKey: mutationKey as string[],
          variables,
        });
        
        setQueuedCount(prev => prev + 1);
        
        // Return a placeholder response
        throw new Error(options.offlineMessage || 'Operation queued for when you\'re online');
      }

      // Execute mutation normally when online
      return options.mutationFn!(variables);
    },
  });

  useEffect(() => {
    if (isOnline && queuedCount > 0) {
      // Notify that queued mutations will be synced
      console.log(`📤 Syncing ${queuedCount} queued operations...`);
    }
  }, [isOnline, queuedCount]);

  return {
    ...mutation,
    isOnline,
  };
}
