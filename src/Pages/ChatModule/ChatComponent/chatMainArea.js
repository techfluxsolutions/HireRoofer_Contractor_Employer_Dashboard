// ============================================
// FILE: components/ChatMainArea.jsx
// ============================================
import React, { useRef, useEffect } from 'react';
import {
  MessageBubble,
  TypingIndicator,
  UserStatusIndicator,
  EmptyState,
  LoadingSpinner,
} from './ChatModule';
import { ChatMessageInput } from './chatMessageInput';

export const ChatMainArea = ({
  selectedConversation,
  messages,
  loading,
  typingUser,
  userStatus,
  userId,
  messageHandlers,
  socketConnected,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Get safe participant data
  const participants = selectedConversation?.participants || [];
  const firstParticipant = participants[0] || {};
  const participantId = firstParticipant._id;
  const participantUsername = firstParticipant.username || 'Unknown User';
  const displayName = selectedConversation?.displayName || participantUsername;
  
  const participantStatus = participantId 
    ? userStatus[participantId]?.status || 'offline'
    : 'offline';

  if (!selectedConversation || participants.length === 0) {
    return (
      <main className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        <EmptyState
          icon="👈"
          title="Select a conversation"
          description="Choose a chat to start messaging"
        />
      </main>
    );
  }


  console.log("MESSAGES",messages)
  return (
    <main className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {displayName}
          </h2>
          {participantUsername && participantUsername !== displayName && (
           <UserStatusIndicator status={participantStatus} />
          )}
        </div>
        
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
          <LoadingSpinner />
        ) : messages.length === 0 ? (
          <EmptyState
            icon="👋"
            title="No messages yet"
            description="Start the conversation!"
          />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id || msg.timestamp || Math.random()}
                message={msg}
                isSent={msg.senderId === userId}
                onDelivered={messageHandlers.handleMarkMessageAsDelivered}
              />
            ))}
            {typingUser && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <ChatMessageInput
        messageHandlers={messageHandlers}
        socketConnected={socketConnected}
      />
    </main>
  );
};