/**
 * Offline Indicator Component
 * Visual indicator showing online/offline status
 */

import { useOnlineStatus, useConnectionQuality } from '../../hooks/useOnlineStatus';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const connectionInfo = useConnectionQuality();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Always show when offline
    if (!isOnline) {
      setShow(true);
      return;
    }

    // Show briefly when coming back online
    if (isOnline) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!show) return null;

  const getConnectionQualityColor = () => {
    if (!isOnline) return 'text-destructive';
    if (connectionInfo.effectiveType === '4g') return 'text-green-500';
    if (connectionInfo.effectiveType === '3g') return 'text-yellow-500';
    if (connectionInfo.effectiveType === '2g') return 'text-orange-500';
    return 'text-muted-foreground';
  };

  const getConnectionQualityText = () => {
    if (!isOnline) return 'Offline';
    if (connectionInfo.effectiveType) {
      return `${connectionInfo.effectiveType.toUpperCase()}`;
    }
    return 'Online';
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
        isOnline
          ? 'bg-green-500/10 border border-green-500/20'
          : 'bg-destructive/10 border border-destructive/20'
      }`}
    >
      {isOnline ? (
        <>
          {connectionInfo.effectiveType ? (
            <Signal className={`h-4 w-4 ${getConnectionQualityColor()}`} />
          ) : (
            <Wifi className="h-4 w-4 text-green-500" />
          )}
          <span className="text-sm font-medium text-foreground">
            {getConnectionQualityText()}
          </span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium text-foreground">
            Offline Mode
          </span>
        </>
      )}
    </div>
  );
}

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>
          You're currently offline. Some features may be limited. 
          Changes will sync when you're back online.
        </span>
      </div>
    </div>
  );
}
