import React from "react";

export function MessageBubble({ message, isSent, onDelivered }) {
  React.useEffect(() => {
    if (!isSent && message.deliveryStatus === "sent") {
      onDelivered?.(message._id);
    }
  }, [message]);

  const getDeliveryIcon = () => {
    if (message.deliveryStatus === "read") return "✓✓";
    if (message.deliveryStatus === "delivered") return "✓✓";
    return "✓";
  };

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${isSent
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-300 text-gray-900 rounded-bl-none"
          }`}
      >
        {message.type === "text" && (
          <p className="break-words">{message.content}</p>
        )}

        {/* {message.type === "image" && (
          <img
            src={message.attachments[0]?.url}
            alt="attachment"
            className="max-w-full rounded"
          />
        )}

        {message.type === "file" && (
          <a
            href={message.attachments[0]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${
              isSent ? "text-blue-100" : "text-blue-600"
            }`}
          >
            📎 {message.attachments[0]?.name}
          </a>
        )} */}


        {message.type === "image" && (
          <img
            src={message.attachments[0]?.url}
            className="max-w-xs rounded-lg cursor-pointer"
          />
        )}

        {message.type === "video" && (
          <video
            controls
            className="max-w-xs rounded-lg"
            src={message.attachments[0]?.url}
          />
        )}

        {message.type === "audio" && (
          <audio controls src={message.attachments[0]?.url} />
        )}

        {message.type === "file" && (
          <a
            href={message.attachments[0]?.url}
            download
            className={`flex items-center gap-2 underline ${isSent ? "text-blue-100" : "text-blue-600"
              }`}
          >
            📎 {message.attachments[0]?.name}
          </a>
        )}


        <div className="flex justify-between items-center gap-2 mt-1">
          <span
            className={`text-xs ${isSent ? "text-blue-100" : "text-gray-600"}`}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isSent && (
            <span
              className={`text-xs font-bold ${message.deliveryStatus === "read"
                  ? "text-blue-200"
                  : "text-gray-300"
                }`}
            >
              {getDeliveryIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

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
}) {
  return (
    <div
      className={`p-4 border-b border-gray-100 cursor-pointer transition duration-200 ${isActive
          ? "bg-blue-50 border-l-4 border-l-blue-600"
          : "hover:bg-gray-50"
        }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 truncate">
            {conversation?.participants[1]?.username || "Private Chat"}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {conversation.lastMessage?.content?.substring(0, 50) ||
              "No messages"}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
}

export function UserListItem({ user, status, onClick }) {

  console.log("USER",user)
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
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.username[0].toUpperCase()}
          </div>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[status.status] || statusColors.offline
              }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm truncate">
            {user.username}
          </h4>
          <p className="text-xs text-gray-500">{status.status || "offline"}</p>
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