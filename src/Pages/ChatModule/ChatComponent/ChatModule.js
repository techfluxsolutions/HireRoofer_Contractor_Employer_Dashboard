

import React, { useState } from "react";

// Tab component for switching between conversation types
export function ConversationTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-200 bg-white">
      <button
        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
          activeTab === 'individual'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('individual')}
      >
        👤 Individual
      </button>
      <button
        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
          activeTab === 'crew'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('crew')}
      >
        👥 Crew
      </button>
    </div>
  );
}

// export const MessageBubble = ({ message, isSent, onDelivered }) => {
//   if (!message) return null;
  
//   const senderName = message.senderId?.username || message.senderId?.name || 'Unknown';
//   const content = message.text || '';
//   const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : '';
  
//   return (
//     <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
//       <div className={`max-w-xs lg:max-w-md rounded-lg p-3 ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
//         {!isSent && <p className="text-xs font-semibold mb-1">{senderName}</p>}
//         <p>{content}</p>
//         {timestamp && <p className="text-xs opacity-70 mt-1">{timestamp}</p>}
//       </div>
//     </div>
//   );
// };


// export const MessageBubble = ({ message }) => {
//   if (!message) return null;

//   const isSender = message?.isMe; // isMe === sender
//   //  const isSender = message.senderId === currentUserId;
//   const content = message?.text || '';
//   const timestamp = message?.createdAt
//     ? new Date(message?.createdAt).toLocaleTimeString([], {
//         hour: '2-digit',
//         minute: '2-digit',
//       })
//     : '';

//   return (
//     <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
//       <div
//         className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
//           isSender
//             ? 'bg-blue-500 text-white rounded-br-none'
//             : 'bg-gray-200 text-gray-800 rounded-bl-none'
//         }`}
//       >
//         <p className="text-sm break-words">{content}</p>

//         {timestamp && (
//           <p className="text-[10px] opacity-70 mt-1 text-right">
//             {timestamp}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

export const MessageBubble = ({ message }) => {
  if (!message) return null;

  const isSender = message?.isMe;
  const { text, type, attachments = [], createdAt } = message;

  const timestamp = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
          isSender
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {/* TEXT MESSAGE */}
        {text && <p className="text-sm break-words mb-1">{text}</p>}

        {/* ATTACHMENTS (IMAGES / FILES) */}
        {type === 'file' && attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((file, index) => (
              <img
                key={index}
                src={file.thumbnailUrl}
                alt="attachment"
                className="rounded-md max-w-full cursor-pointer border"
                onClick={() => window.open(file.thumbnailUrl, '_blank')}
              />
            ))}
          </div>
        )}

        {/* TIMESTAMP */}
        {timestamp && (
          <p className="text-[10px] opacity-70 mt-1 text-right">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};


export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-gray-300 rounded-lg rounded-bl-none px-4 py-3">
        <div className="flex gap-2">
          <div
            className="w-2 h-2 bg-gray-600 rounded-full"
            style={{ animation: "bounce 1.4s infinite" }}
          />
          <div
            className="w-2 h-2 bg-gray-600 rounded-full"
            style={{ animation: "bounce 1.4s infinite 0.2s" }}
          />
          <div
            className="w-2 h-2 bg-gray-600 rounded-full"
            style={{ animation: "bounce 1.4s infinite 0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}

export function UserStatusIndicator({ status }) {
  const statusConfig = {
    online: { color: "bg-green-500", label: "Online" },
    away: { color: "bg-yellow-500", label: "Away" },
    offline: { color: "bg-gray-400", label: "Offline" },
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 ${config.color} rounded-full`} />
      <span className="text-sm text-gray-600">{config.label}</span>
    </div>
  );
}

export function NotificationBadge({ count, onClick }) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition duration-200"
    >
      <span>🔔</span>
      <span className="text-sm font-semibold">Notifications</span>
      <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {count}
      </span>
    </button>
  );
}

export function ConversationItem({
  conversation,
  isActive,
  unreadCount,
  onClick,
  type = 'individual' // 'individual' or 'crew'
}) {
  const getDisplayName = () => {
    if (conversation.displayName) return conversation.displayName;
    
    if (type === 'crew') {
      return conversation.name || "Crew Chat";
    }
    
    // For individual chats, show the other participant's name
    const participants = conversation.participants || [];
    console.log("PARTI",conversation)
    if (participants.length > 1) {
      const currentUserId = localStorage.getItem('userId');
      const otherParticipant = participants.find(p => p._id !== currentUserId);
      return otherParticipant?.name || otherParticipant?.username || "Private Chat";
    }
    
    return conversation?.name || "Private Chat";
  };

  const getAvatar = () => {
    if (type === 'crew') {
      return "👥";
    }
    return "👤";
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 cursor-pointer transition duration-200 ${
        isActive
          ? "bg-blue-50 border-l-4 border-l-blue-600"
          : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getAvatar()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800 truncate">
              {getDisplayName()}
            </h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate mt-1">
            {conversation.lastMessage?.content?.substring(0, 50) ||
              "No messages"}
          </p>
          {type === 'crew' && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-400">
                {conversation.memberCount || conversation.participants?.length || 0} members
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function UserListItem({ user, status, onClick }) {
  if (!user) return null; // extra safety

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-400",
  };

  return (
    <div
      className="p-3 rounded-lg hover:bg-gray-100 transition duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative ">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {(user.name?.[0] || "").toUpperCase()}
          </div>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              statusColors[status?.status] || statusColors.offline
            }`}
          />
        </div>
        <div className=" min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm truncate">
            {user.name || "Unknown User"}
          </h4>
          <p className="text-xs text-gray-500 capitalize">
            {user.lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
}


export function EmptyState({ title, description, icon = "👋" }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-4xl mb-4">{icon}</p>
        <p className="text-gray-500 text-lg font-semibold mb-2">{title}</p>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    </div>
  );
}

export function Toast({ message, type = "info", onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
      warning: "bg-yellow-500",
    }[type] || "bg-blue-500";

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up`}
    >
      {message}
    </div>
  );
}

// Crew-specific components
export function CrewMemberItem({ member, isAdmin }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
          {member.name?.[0]?.toUpperCase() || "U"}
        </div>
        <span className="text-sm text-gray-700">{member.name}</span>
      </div>
      {isAdmin && (
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Admin</span>
      )}
    </div>
  );
}

