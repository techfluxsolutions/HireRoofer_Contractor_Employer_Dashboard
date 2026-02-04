// ============================================
// FILE: hooks/useProfileStatusSocket.js
// ============================================
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { getAccessToken } from '../../../../utils/APIs/commonHeadApiLogic';
// import { getAccessToken } from '../../../utils/APIs/commonHeadApiLogic';

export const useProfileStatusSocket = (baseUrl, onToast) => {
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
      onToast?.('Please log in to use profile status updates', 'error');
      return;
    }

    console.log('🔌 Initializing profile status socket connection...');
    
    // Connect to the profile-status namespace
    const newSocket = io(`${baseUrl}/profile-status`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Disconnecting profile status socket...');
      newSocket.disconnect();
    };
  }, [baseUrl]);

  return { socket, socketConnected, setSocketConnected };
};