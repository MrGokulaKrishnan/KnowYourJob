import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="bg-rose-600/90 text-white text-xs font-semibold py-2 px-4 text-center fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md border border-rose-500/30">
        <WifiOff size={16} />
        <span>You are currently offline. Cached jobs remain available.</span>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="bg-emerald-600/90 text-white text-xs font-semibold py-2 px-4 text-center fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md border border-emerald-500/30 animate-fade-in">
        <Wifi size={16} />
        <span>Connection restored. Online services operational.</span>
      </div>
    );
  }

  return null;
};
