import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../ChatModule/Hooks/useSocket';
import { GetVerifyStatusEmployerAPI } from '../../../utils/APIs/VerificationWaitingContractorEmployerApis';

const VerificatioEmployerWaitingPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  const { socket, setSocketConnected } = useSocket(
    process.env.REACT_APP_HIRE_ROOFER_WEBSITE_BASE_API_URL,
    (msg, type) => console.log(type, msg)
  );

  // 🔹 API CALL (Authorized)
  const fetchVerificationStatus = useCallback(async () => {
    try {
      const response = await GetVerifyStatusEmployerAPI();
      console.log("WAITING RESPONSE",response?.data?.data)
      const data = response?.data?.data;

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
    socket.on('connect', async() => {
      console.log('✅ Socket connected');
      setSocketConnected(true);
       console.log('✅ Socket connected — calling verification API');

 

  console.log('✅ Verification API call finished');
      // 🔥 CALL API THROUGH SOCKET FLOW
 await fetchVerificationStatus();
    });

    // ✅ Socket real-time updates
    socket.on('verification-status', (data) => {
      console.log('📩 Socket verification update:', data);
      console.log('📩 SOCKET EVENT RECEIVED:', data);

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

export default VerificatioEmployerWaitingPage;




// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useProfileStatusSocket } from './Hook/useProfileStatusSocket';
// import { getAccessToken } from '../../../utils/APIs/commonHeadApiLogic';
// import { GetVerifyStatusEmployerAPI } from '../../../utils/APIs/VerificationWaitingContractorEmployerApis';
// // import { useProfileStatusSocket } from './Hook/useProfileStatusSocket';
// // import { getAccessToken } from '../../../utils/APIs/commonHeadApiLogic';
// // import { GetVerifyStatusEmployerAPI } from '../../../utils/APIs/VerificationWaitingContractorEmployerApis';

// const VerificatioEmployerWaitingPage = () => {
//   const navigate = useNavigate();
//   const [status, setStatus] = useState('processing');
//   const [userId, setUserId] = useState(null);
  
//   // Use the new profile status socket hook
//   const { socket, setSocketConnected } = useProfileStatusSocket(
//     process.env.REACT_APP_HIRE_ROOFER_WEBSITE_BASE_API_URL,
//     (msg, type) => console.log(type, msg)
//   );

//   // Get user ID from token
//   useEffect(() => {
//     const token = getAccessToken();
//     if (token) {
//       try {
//         // Decode JWT token to get user ID
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         setUserId(payload.userId);
//         console.log('👤 User ID from token:', payload.userId);
//       } catch (error) {
//         console.error('❌ Error decoding token:', error);
//       }
//     }
//   }, []);

//   // 🔹 API CALL (Authorized)
//   const fetchVerificationStatus = useCallback(async () => {
//     try {
//       console.log('🔍 Calling verification status API...');
//       const response = await GetVerifyStatusEmployerAPI();
//       console.log("WAITING RESPONSE", response?.data?.data);
      
//       const data = response?.data?.data;
      
//       if (data?.status === 'approved') {
//         console.log('✅ Status is approved - navigating to dashboard');
//         setStatus('approved');
//         navigate('/dashboard');
//       } else if (data?.status === 'rejected') {
//         console.log('❌ Status is rejected');
//         setStatus('rejected');
//       } else {
//         console.log('⏳ Status is still processing');
//         setStatus('processing');
//       }
//     } catch (error) {
//       console.error('❌ Verification status API failed', error);
//     }
//   }, [navigate]);

//   // 🔹 INITIAL API CALL ON MOUNT
//   useEffect(() => {
//     console.log('🚀 Component mounted - calling initial API');
//     fetchVerificationStatus();
//   }, [fetchVerificationStatus]);

//   // 🔹 SOCKET SETUP
//   useEffect(() => {
//     if (!socket || !userId) return;

//     console.log('🔌 Setting up socket listeners...');

//     // ✅ Socket connected
//     socket.on('connect', () => {
//       console.log('✅ Profile status socket connected');
//       setSocketConnected(true);
      
//       // Join profile updates room
//       console.log('📡 Joining profile updates room...');
//       socket.emit('joinProfileUpdates', {
//         userId: userId,
//         role: 'employer'
//       });
//     });

//     // ✅ Profile status connected confirmation
//     socket.on('profileStatusConnected', (data) => {
//       console.log('✅ Profile status connection confirmed:', data);
//     });

//     // ✅ Listen for profile status updates
//     socket.on('profileStatusUpdate', (data) => {
//       console.log('📩 Socket profile status update:', data);
      
//       if (data.status === 'approved') {
//         console.log('✅ Socket: Status approved - navigating to dashboard');
//         setStatus('approved');
//         navigate('/dashboard');
//       } else if (data.status === 'rejected') {
//         console.log('❌ Socket: Status rejected');
//         setStatus('rejected');
//       } else {
//         console.log('⏳ Socket: Status still processing');
//         setStatus('processing');
//       }
//     });

//     // ✅ Handle reconnect
//     socket.on('reconnect', () => {
//       console.log('🔁 Profile status socket reconnected');
//       // Re-join the room
//       socket.emit('joinProfileUpdates', {
//         userId: userId,
//         role: 'employer'
//       });
//       // Fetch latest status
//       fetchVerificationStatus();
//     });

//     socket.on('disconnect', () => {
//       console.log('❌ Profile status socket disconnected');
//       setSocketConnected(false);
//     });

//     socket.on('error', (error) => {
//       console.error('❌ Profile status socket error:', error);
//     });

//     // 🧹 Cleanup
//     return () => {
//       socket.off('connect');
//       socket.off('profileStatusConnected');
//       socket.off('profileStatusUpdate');
//       socket.off('reconnect');
//       socket.off('disconnect');
//       socket.off('error');
//     };
//   }, [socket, userId, fetchVerificationStatus, navigate, setSocketConnected]);

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div
//         className="bg-white rounded-2xl shadow-xl border border-[#A6A6A6]
//                    p-12 w-full max-w-4xl min-h-[700px]
//                    text-center flex flex-col justify-center"
//       >
//         {/* Logo */}
//         <div className="flex justify-center mb-8">
//           <img
//             src="/assets/logo.png"
//             alt="Hire Roofer"
//             className="h-[125px]"
//           />
//         </div>

//         {/* Illustration */}
//         <div className="flex justify-center mb-10">
//           <img
//             src="/assets/waitingImage.png"
//             alt="Processing"
//             className="h-56 object-contain"
//           />
//         </div>

//         {/* Text */}
//         <h2 className="text-2xl font-semibold text-gray-800 mb-3">
//           Thanks for applying
//         </h2>
//         <p className="text-gray-500 text-base mb-10">
//           We are currently processing your application
//         </p>

//         {/* Status Display */}
//         {status === 'processing' && (
//           <div className="flex justify-center">
//             <div className="w-9 h-9 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
//           </div>
//         )}

//         {status === 'rejected' && (
//           <p className="text-red-500 text-sm mt-6">
//             Your verification was rejected. Please contact support.
//           </p>
//         )}

//         {status === 'approved' && (
//           <p className="text-green-500 text-sm mt-6">
//             Your profile has been approved! Redirecting to dashboard...
//           </p>
//         )}
       
//       </div>
//     </div>
//   );
// };

// export default VerificatioEmployerWaitingPage;