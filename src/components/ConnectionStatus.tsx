'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

const ConnectionStatus: React.FC = () => {
  const { isConnected, lastPing, error, reconnect } = useWebSocket();
  const { config } = useWhiteLabel();
  const [showStatus, setShowStatus] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show connection status when there's an error or disconnection
  useEffect(() => {
    if (!isConnected || error) {
      setShowStatus(true);
    } else {
      // Hide status after 5 seconds if connected
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, error]);

  // Format last ping time
  const formatLastPing = () => {
    if (!lastPing) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - lastPing.getTime();
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      return lastPing.toLocaleTimeString();
    }
  };

  if (!showStatus) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="relative rounded-md shadow-md p-2 flex items-center space-x-2 cursor-pointer"
        style={{ 
          backgroundColor: isConnected ? '#f0fdf4' : error ? '#fef2f2' : '#f3f4f6',
          borderColor: isConnected ? '#86efac' : error ? '#fca5a5' : '#d1d5db',
          borderWidth: '1px'
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div 
          className="h-3 w-3 rounded-full"
          style={{ 
            backgroundColor: isConnected ? '#22c55e' : error ? '#ef4444' : '#9ca3af',
            animation: isConnected ? 'pulse 2s infinite' : 'none'
          }}
        />
        <span className="text-xs font-medium">
          {isConnected ? 'Connected' : error ? 'Connection Error' : 'Disconnected'}
        </span>
        
        {!isConnected && (
          <button
            className="ml-2 text-xs font-medium px-2 py-0.5 rounded"
            style={{ 
              backgroundColor: config?.primaryColor || '#3b82f6',
              color: 'white'
            }}
            onClick={(e) => {
              e.stopPropagation();
              reconnect();
            }}
          >
            Reconnect
          </button>
        )}
        
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white rounded-md shadow-lg text-xs">
            <div className="font-medium mb-1">Connection Status</div>
            <div className="mb-1">
              <span className="font-medium">Status:</span>{' '}
              {isConnected ? 'Connected' : error ? 'Error' : 'Disconnected'}
            </div>
            {lastPing && (
              <div className="mb-1">
                <span className="font-medium">Last Activity:</span> {formatLastPing()}
              </div>
            )}
            {error && (
              <div className="mb-1">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            <div className="text-gray-500 mt-2">
              {isConnected 
                ? 'You are receiving real-time updates.' 
                : 'You are not receiving real-time updates. Click "Reconnect" to try again.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;

// Add keyframes for pulse animation
const pulseKeyframes = `
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
`;

// Add the keyframes to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = pulseKeyframes;
  document.head.appendChild(style);
}
