
// ============================================
// FILE: hooks/useSocket.js
// ============================================
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { getAccessToken } from '../../../utils/APIs/commonHeadApiLogic';

export const useSocket = (baseUrl, onToast) => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!baseUrl) {
      console.error('❌ BASE_URL not configured');
      onToast?.('Configuration error: BASE_URL missing', 'error');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      console.error('❌ No authentication token available');
      onToast?.('Please log in to use chat', 'error');
      return;
    }

    console.log('🔌 Initializing socket connection...');
    const newSocket = io(baseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Disconnecting socket...');
      newSocket.disconnect();
    };
  }, [baseUrl]);

  return { socket, socketConnected, setSocketConnected };
};
