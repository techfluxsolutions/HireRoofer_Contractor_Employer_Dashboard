import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../ChatModule/Hooks/useSocket';
import { GetVerifyStatusEmployerAPI } from '../../../utils/APIs/VerificationWaitingContractorEmployerApis';

const VerificationWaitingPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  const { socket, setSocketConnected } = useSocket(
    process.env.REACT_APP_SOCKET_URL,
    (msg, type) => console.log(type, msg)
  );

  // 🔹 API CALL (Authorized)
  const fetchVerificationStatus = useCallback(async () => {
    try {
      const response = await GetVerifyStatusEmployerAPI();

      const data = response?.data;

      if (data?.status === 'approved') {
        setStatus('approved');
        navigate('/dashboard');
      } else if (data?.status === 'rejected') {
        setStatus('rejected');
      } else {
        setStatus('processing');
      }
    } catch (error) {
      console.error('❌ Verification status API failed', error);
    }
  }, [navigate]);

  useEffect(() => {
    if (!socket) return;

    // ✅ Socket connected
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setSocketConnected(true);

      // 🔥 CALL API THROUGH SOCKET FLOW
      fetchVerificationStatus();
    });

    // ✅ Socket real-time updates
    socket.on('verification-status', (data) => {
      console.log('📩 Socket verification update:', data);

      if (data.status === 'approved') {
        setStatus('approved');
        navigate('/dashboard');
      }

      if (data.status === 'rejected') {
        setStatus('rejected');
      }
    });

    // ✅ Handle reconnect
    socket.on('reconnect', () => {
      console.log('🔁 Socket reconnected');
      fetchVerificationStatus();
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setSocketConnected(false);
    });

    // 🧹 Cleanup
    return () => {
      socket.off('connect');
      socket.off('verification-status');
      socket.off('reconnect');
      socket.off('disconnect');
    };
  }, [socket, fetchVerificationStatus, navigate, setSocketConnected]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="bg-white rounded-2xl shadow-xl border border-[#A6A6A6]
                   p-12 w-full max-w-4xl min-h-[700px]
                   text-center flex flex-col justify-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/logo.png"
            alt="Hire Roofer"
            className="h-[125px]"
          />
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-10">
          <img
            src="/assets/waitingImage.png"
            alt="Processing"
            className="h-56 object-contain"
          />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Thanks for applying
        </h2>

        <p className="text-gray-500 text-base mb-10">
          We are currently processing your application
        </p>

        {/* Loader */}
        {status === 'processing' && (
          <div className="flex justify-center">
            <div className="w-9 h-9 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === 'rejected' && (
          <p className="text-red-500 text-sm mt-6">
            Your verification was rejected. Please contact support.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerificationWaitingPage;
