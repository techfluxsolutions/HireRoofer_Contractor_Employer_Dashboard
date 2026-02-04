// ============================================
// FILE: hooks/useSocketListeners.js
// ============================================
import { useEffect } from 'react';

export const useSocketListeners = ({
  socket,
  setSocketConnected,
  setUserStatus,
  setMessages,
  setTypingUser,
  onNewMessage,
  onToast,
  loadConversations,
  loadUnreadNotifications,
  handleMarkMessageAsDelivered,
}) => {
  useEffect(() => {
    if (!socket) return;

    // Connection Events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setSocketConnected(true);
      onToast?.('Connected to chat server', 'success');
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
      setSocketConnected(false);
      onToast?.('Connection error. Retrying...', 'error');
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setSocketConnected(false);
      onToast?.('Disconnected from chat server', 'warning');
    });

    // User Status Events
    socket.on('userOnline', ({ userId }) => {
      console.log(`👤 User ${userId} is online`);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: { status: 'online' },
      }));
    });

    socket.on('userOffline', ({ userId }) => {
      console.log(`👤 User ${userId} is offline`);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: { status: 'offline' },
      }));
    });

    socket.on('userStatusChanged', ({ userId, status }) => {
      console.log(`👤 User ${userId} status changed to ${status}`);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: { status },
      }));
    });

    // Message Events
    socket.on('newMessage', (message) => {
      console.log('📨 New message received:', message);
      setMessages((prev) => [...prev, message]);
      if (message._id) {
        handleMarkMessageAsDelivered(message._id);
      }
      loadConversations();
    });

    socket.on('newMessageNotification', ({ from }) => {
      onToast?.(`New message from ${from}`, 'info');
      loadUnreadNotifications();
    });

    // Typing Events
    socket.on('userTyping', ({ userId, isTyping }) => {
      console.log(`⌨️ User ${userId} typing:`, isTyping);
      setTypingUser(isTyping ? userId : null);
    });

    // Delivery & Read Events
    socket.on('deliveryStatusUpdate', ({ messageId, status }) => {
      console.log(`📬 Message ${messageId} delivery status:`, status);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deliveryStatus: status } : msg
        )
      );
    });

    socket.on('readStatusUpdate', ({ conversationId, readBy }) => {
      console.log(`👁️ ${readBy} read messages in ${conversationId}`);
    });

    // Error Events
    socket.on('messageError', ({ error }) => {
      console.error('❌ Message error:', error);
      onToast?.(`Error: ${error}`, 'error');
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('userStatusChanged');
      socket.off('newMessage');
      socket.off('newMessageNotification');
      socket.off('userTyping');
      socket.off('deliveryStatusUpdate');
      socket.off('readStatusUpdate');
      socket.off('messageError');
    };
  }, [socket]);
};
