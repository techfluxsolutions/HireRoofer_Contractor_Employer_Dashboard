// ============================================
// FILE: components/ChatHeader.jsx
// ============================================
import React, { useState } from 'react';
import { NotificationBadge } from './ChatModule';

export const ChatHeader = ({ 
  socketConnected, 
  notifications, 
  onClearNotifications,
  userRole, // 'employer' or 'worker'
  selectedConversation,
  onSendRequest, // Callback for employer to send request
  onAcceptRequest, // Callback for worker to accept
  onDeclineRequest // Callback for worker to decline
}) => {
  const [requestStatus, setRequestStatus] = useState('pending'); // 'idle', 'pending', 'accepted', 'declined'
  const [isLoading, setIsLoading] = useState(false);

  // Get the other user from conversation
  const getOtherUser = () => {
    if (!selectedConversation?.participants?.length) return null;
    const currentUserId = localStorage.getItem('userId');
    return selectedConversation.participants.find(p => p._id !== currentUserId);
  };

  const handleSendRequest = async () => {
    if (!selectedConversation) {
      console.error('No conversation selected');
      return;
    }

    const otherUser = getOtherUser();
    if (!otherUser) {
      console.error('No other user found');
      return;
    }

    setIsLoading(true);
    try {
      // Call the API to send request
      await onSendRequest?.(otherUser._id, selectedConversation._id);
      setRequestStatus('pending');
    } catch (error) {
      console.error('Failed to send request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAcceptRequest?.(selectedConversation?._id);
      setRequestStatus('accepted');
    } catch (error) {
      console.error('Failed to accept request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await onDeclineRequest?.(selectedConversation?._id);
      setRequestStatus('declined');
    } catch (error) {
      console.error('Failed to decline request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render based on user role and request status
  const renderActionButtons = () => {
    // If no conversation is selected, don't show buttons
    if (!selectedConversation) return null;

    // Employer view
    if (userRole === 'employer') {
      switch (requestStatus) {
        case 'pending':
          return (
            <button
              disabled
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              Request Pending
            </button>
          );
        case 'accepted':
          return (
            <button
              disabled
              className="px-4 py-2 bg-green-500 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              Request Accepted
            </button>
          );
        case 'declined':
          return (
            <button
              disabled
              className="px-4 py-2 bg-red-500 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              Request Declined
            </button>
          );
        default:
          return (
            <button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Work Request'}
            </button>
          );
      }
    }

    // Worker view
    if (userRole === 'worker') {
      switch (requestStatus) {
        case 'accepted':
          return (
            <button
              disabled
              className="px-4 py-2 bg-green-500 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              Request Accepted
            </button>
          );
        case 'declined':
          return (
            <button
              disabled
              className="px-4 py-2 bg-red-500 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              Request Declined
            </button>
          );
        default:
          return (
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Accept'}
              </button>
              <button
                onClick={handleDecline}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Decline'}
              </button>
            </div>
          );
      }
    }

    return null;
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-3xl">💬</span>
        <h1 className="text-2xl font-bold">Chat</h1>
        {socketConnected ? (
          <span className="text-xs bg-green-500 px-2 py-1 rounded-full">
            Connected
          </span>
        ) : (
          <span className="text-xs bg-red-500 px-2 py-1 rounded-full">
            Disconnected
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Action Buttons */}
        {renderActionButtons()}
        
        {/* Notification Badge */}
        <NotificationBadge
          count={notifications.length}
          onClick={onClearNotifications}
        />
      </div>
    </header>
  );
};
