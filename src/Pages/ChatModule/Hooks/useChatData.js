// ============================================
// FILE: hooks/useChatData.js
// ============================================
import { useState, useCallback } from 'react';
import { GetChatUsersAPI, getConversationsAPI, getMessagesAPI, getUnreadNotificationsAPI, getUserStatusAPI, updateUserStatusAPI } from '../../../utils/APIs/chatAPIs';

export const useChatData = (socket, socketConnected, onToast) => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [userStatus, setUserStatus] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageLength,setMessageLength]=useState(0)
  const loadConversations = useCallback(async () => {
    try {
      console.log('📋 Loading conversations...');
      const res = await getConversationsAPI();
      console.log('✅ Conversations loaded:', res.data);
      setConversations(res.data.data || []);
    } catch (err) {
      console.error('❌ Load conversations error:', err);
      onToast?.('Failed to load conversations', 'error');
    }
  }, [onToast]);

  const loadUsers = useCallback(async () => {
    try {
      console.log('👥 Loading users...');
      const res = await getConversationsAPI();
      console.log("CONVERSATION DATA",res?.data?.data)
      const apiUsers = res?.data?.data || [];
      setUsers(apiUsers);

      apiUsers.forEach(async (user) => {
        await loadUserStatus(user._id);
      });
    } catch (err) {
      console.error('❌ Failed to load users:', err);
      onToast?.('Failed to load users', 'error');
    }
  }, [onToast]);

  const loadMessages = useCallback(async (conversationId) => {
    setLoading(true);
    try {
      console.log('💬 Loading messages for:', conversationId);
      const res = await getMessagesAPI(conversationId);
      console.log("MESSAGE LENGTH",res?.data?.data?.length)
      setMessageLength(res?.data?.data?.length)
      console.log('✅ Messages loaded:', res.data);
      setMessages(res.data.data || []);
    } catch (err) {
      console.error('❌ Load messages error:', err);
      onToast?.('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  const loadUnreadNotifications = useCallback(async () => {
    try {
      console.log('🔔 Loading notifications...');
      const res = await getUnreadNotificationsAPI();
      console.log('✅ Notifications loaded:', res.data);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('❌ Load notifications error:', err);
    }
  }, []);

  const loadUserStatus = useCallback(async (userId) => {
    try {
      const res = await getUserStatusAPI(userId);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: res.data.data || { status: 'offline' },
      }));
    } catch (error) {
      console.error(`❌ Failed to get status for user ${userId}:`, error);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: { status: 'offline' },
      }));
    }
  }, []);

  const markUserOnline = useCallback(async () => {
    try {
      console.log('🟢 Marking user as online...');
      await updateUserStatusAPI('online');
      if (socket && socketConnected) {
        socket.emit('updateStatus', { status: 'online' });
      }
      console.log('✅ User marked as online');
    } catch (error) {
      console.error('❌ Failed to update status:', error);
    }
  }, [socket, socketConnected]);

  return {
    conversations,
    users,
    userStatus,
    notifications,
    messages,
    loading,
    messageLength,
    setConversations,
    setUsers,
    setUserStatus,
    setNotifications,
    setMessages,
    setLoading,
    loadConversations,
    loadUsers,
    loadMessages,
    loadUnreadNotifications,
    loadUserStatus,
    markUserOnline,
  };
};