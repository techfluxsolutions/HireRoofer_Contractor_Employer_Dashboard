// ============================================
// FILE: ChatApp.jsx (Main Component)
// ============================================
import React, { useState, useEffect } from 'react';
import { Toast } from './ChatModule';

import { useChatData } from './Hooks/useChatData';
import { useMessageHandler } from './Hooks/useMessageHandler';
import { useSocketListeners } from './Hooks/useSocketListeners';
import { markNotificationsReadAPI } from '../../utils/APIs/chatAPIs';
import { ChatHeader } from './ChatComponent/ChatHeader';
import { ChatSidebar } from './ChatComponent/chatSidebar';
import { ChatMainArea } from './ChatComponent/chatMainArea';
import { useSocket } from './Hooks/useSocket';

const BASE_URL = process.env.REACT_APP_HIRE_ROOFER_WEBSITE_BASE_API_URL;

export default function CompleteChatModule() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [toast, setToast] = useState(null);

  const userId = localStorage.getItem('userId');
  
  const showToast = (message, type = 'info') => {
    console.log(`🔔 Toast [${type}]:`, message);
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initialize Socket
  const { socket, socketConnected, setSocketConnected } = useSocket(
    BASE_URL,
    showToast
  );

  // Initialize Chat Data
  const {
    conversations,
    users,
    userStatus,
    notifications,
    messages,
    loading,
    messageLength,
    setUserStatus,
    setMessages,
    setNotifications,
    loadConversations,
    loadUsers,
    loadMessages,
    loadUnreadNotifications,
    markUserOnline,
  } = useChatData(socket, socketConnected, showToast);

  // Initialize Message Handler
  const messageHandlers = useMessageHandler(
    socket,
    socketConnected,
    selectedConversation,
    messageLength,
    userId,
    showToast
  );

  // Setup Socket Listeners
  useSocketListeners({
    socket,
    setSocketConnected,
    setUserStatus,
    setMessages,
    setTypingUser,
    onToast: showToast,
    loadConversations,
    loadUnreadNotifications,
    handleMarkMessageAsDelivered: messageHandlers.handleMarkMessageAsDelivered,
  });


  // Initialize App Data
  useEffect(() => {
    if (socketConnected) {
      setupApp();
    }
  }, [socketConnected]);

  console.log("MISS Length",messageLength)

  const setupApp = async () => {
    try {
      await Promise.all([
        loadConversations(),
        loadUsers(),
        loadUnreadNotifications(),
        markUserOnline(),
      ]);
      console.log('✅ App setup complete');
    } catch (error) {
      console.error('❌ Setup error:', error);
      showToast('Failed to initialize app', 'error');
    }
  };

  // In ChatApp.jsx, update the selectConversation function:
  const selectConversation = (conversation) => {
    console.log("INDIVIDUAL...",conversation)
    // if (!conversation || !conversation.participants || conversation.participants.length === 0) {
    //   console.error('❌ Invalid conversation selected:', conversation);
    //   showToast('Invalid conversation', 'error');
    //   return;
    // }

    console.log('📂 Selecting conversation:', conversation?.participants?.[0]?.conversationId);
    setSelectedConversation(conversation);
    

    if (conversation?.participants?.[0]?.conversationId && socket) {
      loadMessages(conversation?.participants?.[0]?.conversationId);
      socket.emit('joinRoom', conversation?.participants?.[0]?.conversationId);
      messageHandlers.handleMarkMessagesAsRead(conversation?.participants?.[0]?.conversationId);
    } else {
      setMessages([]);
    }
  };

  const handleMarkNotificationsAsRead = async () => {
    try {
      console.log('🔕 Marking notifications as read...');
      await markNotificationsReadAPI();
      setNotifications([]);
      showToast('Notifications cleared', 'success');
    } catch (err) {
      console.error('❌ Mark notifications error:', err);
      showToast('Failed to clear notifications', 'error');
    }
  };

  const [userRole, setUserRole] = useState(''); // 'employer' or 'worker'

  const [crewConversations, setCrewConversations] = useState([]);

  // Separate conversations by type
  const individualConversations = conversations.filter(conv =>
    conv.type === 'individual' || !conv.type
  );
  const allCrewConversations = conversations.filter(conv =>
    conv.type === 'crew'
  );

  // Function to create a new crew
  const handleCreateCrew = async () => {
    try {
      showToast('Create crew feature coming soon!', 'info');
    } catch (error) {
      console.error('Failed to create crew:', error);
      showToast('Failed to create crew', 'error');
    }
  };



  // Get user role on component mount
  useEffect(() => {
    const role = sessionStorage.getItem('userRole') || 'employer'; // Adjust based on your auth
    setUserRole(role);
  }, []);

  const handleSendWorkRequest = async (workerId, conversationId) => {
    try {
      // Call your API to send work request
      // Example: await sendWorkRequestAPI({ workerId, conversationId });
      console.log('Sending work request to:', workerId);
      showToast('Work request sent successfully', 'success');
    } catch (error) {
      console.error('Failed to send work request:', error);
      showToast('Failed to send work request', 'error');
    }
  };

  const handleAcceptWorkRequest = async (conversationId) => {
    try {
      // Call your API to accept work request
      // Example: await acceptWorkRequestAPI(conversationId);
      console.log('Accepting work request:', conversationId);
      showToast('Work request accepted', 'success');
    } catch (error) {
      console.error('Failed to accept work request:', error);
      showToast('Failed to accept work request', 'error');
    }
  };

  const handleDeclineWorkRequest = async (conversationId) => {
    try {
      // Call your API to decline work request
      // Example: await declineWorkRequestAPI(conversationId);
      console.log('Declining work request:', conversationId);
      showToast('Work request declined', 'info');
    } catch (error) {
      console.error('Failed to decline work request:', error);
      showToast('Failed to decline work request', 'error');
    }
  };



  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ChatHeader
        socketConnected={socketConnected}
        notifications={notifications}
        onClearNotifications={handleMarkNotificationsAsRead}
        userRole={userRole} // Get this from your auth/user context
        selectedConversation={selectedConversation}
        onSendRequest={handleSendWorkRequest}
        onAcceptRequest={handleAcceptWorkRequest}
        onDeclineRequest={handleDeclineWorkRequest}
      />

      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        <ChatSidebar
          conversations={conversations} // Pass all conversations, filter happens in sidebar
          users={users}
          userStatus={userStatus}
          selectedConversation={selectedConversation}
          onSelectConversation={selectConversation}
          onCreateCrew={handleCreateCrew}
        />

        <ChatMainArea
          selectedConversation={selectedConversation}
          messages={messages}
          loading={loading}
          typingUser={typingUser}
          userStatus={userStatus}
          userId={userId}
          messageHandlers={messageHandlers}
          socketConnected={socketConnected}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}