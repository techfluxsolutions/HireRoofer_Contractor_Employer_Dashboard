import React, { useState } from 'react';

export const ChatRequestActions = ({
  userRole,
  selectedConversation,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getOtherUser = () => {
    if (!selectedConversation?.participants?.length) return null;
    const currentUserId = localStorage.getItem('userId');
    return selectedConversation.participants.find(
      (p) => p._id !== currentUserId
    );
  };

  const handleSendRequest = async () => {
    const otherUser = getOtherUser();
    if (!otherUser) return;

    setIsLoading(true);
    try {
      await onSendRequest(otherUser._id, selectedConversation._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAcceptRequest(selectedConversation._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await onDeclineRequest(selectedConversation._id);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedConversation) return null;

  const status = selectedConversation.requestStatus || 'idle';

  /* ---------------- EMPLOYER ---------------- */
  if (userRole === 'employer') {
    return (
      <button
        onClick={handleSendRequest}
        disabled={isLoading || status !== 'idle'}
        className={`px-4 py-2 rounded-lg text-white text-sm
          ${status === 'idle'
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {status === 'idle'
          ? isLoading ? 'Sending...' : 'Send Work Request'
          : 'Request Sent'}
      </button>
    );
  }

  /* ---------------- WORKER ---------------- */
  if (userRole === 'worker') {
    if (status === 'accepted') {
      return (
        <span className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm opacity-70">
          Request Accepted
        </span>
      );
    }

    if (status === 'declined') {
      return (
        <span className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm opacity-70">
          Request Declined
        </span>
      );
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          disabled={isLoading}
          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
        >
          Decline
        </button>
      </div>
    );
  }

  return null;
};
