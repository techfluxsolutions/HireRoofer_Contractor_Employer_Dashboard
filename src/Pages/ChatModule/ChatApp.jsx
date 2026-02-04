import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  MessageBubble,
  TypingIndicator,
  UserStatusIndicator,
  NotificationBadge,
  ConversationItem,
  UserListItem,
  EmptyState,
  LoadingSpinner,
  Toast,
} from "./ChatModule";
import { getAccessToken } from "../../utils/APIs/commonHeadApiLogic";
import {
  GetChatUsersAPI,
  getConversationsAPI,
  getMessagesAPI,
  getUnreadNotificationsAPI,
  markNotificationsReadAPI,
  uploadChatFileAPI,
  updateUserStatusAPI,
  getUserStatusAPI,
  markMessagesReadAPI,
  markMessageDeliveredAPI,
  sendChatMessageAPI,
} from "../../utils/APIs/chatAPIs";

const BASE_URL = process.env.REACT_APP_HIRE_ROOFER_WEBSITE_BASE_API_URL;

export default function ChatApp() {
  // State Management
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [userStatus, setUserStatus] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");

 

  // Initialize Socket Connection
  useEffect(() => {
    if (!BASE_URL) {
      console.error("❌ BASE_URL not configured");
      showToast("Configuration error: BASE_URL missing", "error");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      console.error("❌ No authentication token available");
      showToast("Please log in to use chat", "error");
      return;
    }

    console.log("🔌 Initializing socket connection...");
    const newSocket = io(BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    return () => {
      console.log("🔌 Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  // Setup Socket Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setSocketConnected(true);
      showToast("Connected to chat server", "success");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
      setSocketConnected(false);
      showToast("Connection error. Retrying...", "error");
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setSocketConnected(false);
      showToast("Disconnected from chat server", "warning");
    });

    // User Status Events
    socket.on("userOnline", ({ userId }) => {
      console.log(`👤 User ${userId} is online`);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: { status: "online" },
      }));
    });

    socket.on("userOffline", ({ userId }) => {
      console.log(`👤 User ${userId} is offline`);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: { status: "offline" },
      }));
    });

    socket.on("userStatusChanged", ({ userId, status }) => {
      console.log(`👤 User ${userId} status changed to ${status}`);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: { status },
      }));
    });

    // Message Events
    socket.on("newMessage", (message) => {
      console.log("📨 New message received:", message);
      setMessages((prev) => [...prev, message]);
      if (message._id) {
        handleMarkMessageAsDelivered(message._id);
      }
      loadConversations();
    });

    socket.on("newMessageNotification", ({ from, message }) => {
      showToast(`New message from ${from}`, "info");
      loadUnreadNotifications();
    });

    // Typing Events
    socket.on("userTyping", ({ userId, isTyping }) => {
      console.log(`⌨️ User ${userId} typing:`, isTyping);
      setTypingUser(isTyping ? userId : null);
    });

    // Delivery & Read Events
    socket.on("deliveryStatusUpdate", ({ messageId, status }) => {
      console.log(`📬 Message ${messageId} delivery status:`, status);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deliveryStatus: status } : msg
        )
      );
    });

    socket.on("readStatusUpdate", ({ conversationId, readBy }) => {
      console.log(`👁️ ${readBy} read messages in ${conversationId}`);
    });

    // Room Events
    socket.on("userJoinedRoom", ({ userId, conversationId }) => {
      console.log(`🚪 User ${userId} joined room ${conversationId}`);
    });

    socket.on("userLeftRoom", ({ userId, conversationId }) => {
      console.log(`🚪 User ${userId} left room ${conversationId}`);
    });

    socket.on("messageError", ({ error }) => {
      console.error("❌ Message error:", error);
      showToast(`Error: ${error}`, "error");
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("userStatusChanged");
      socket.off("newMessage");
      socket.off("newMessageNotification");
      socket.off("userTyping");
      socket.off("deliveryStatusUpdate");
      socket.off("readStatusUpdate");
      socket.off("userJoinedRoom");
      socket.off("userLeftRoom");
      socket.off("messageError");
    };
  }, [socket]);

  // Initialize App Data
  useEffect(() => {
    if (socketConnected) {
      setupApp();
    }
  }, [socketConnected]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setupApp = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConversations(),
        loadUsers(),
        loadUnreadNotifications(),
        markUserOnline(),
      ]);
      console.log("✅ App setup complete");
    } catch (error) {
      console.error("❌ Setup error:", error);
      showToast("Failed to initialize app", "error");
    } finally {
      setLoading(false);
    }
  };

  // API Calls
  const loadConversations = async () => {
    try {
      console.log("📋 Loading conversations...");
      const res = await getConversationsAPI();
      console.log("✅ Conversations loaded:", res.data);
      setConversations(res.data.data || []);
    } catch (err) {
      console.error("❌ Load conversations error:", err);
      showToast("Failed to load conversations", "error");
    }
  };

const loadUsers = async () => {
  try {
    console.log("👥 Loading users...");
    const res = await getConversationsAPI();
    console.log("CHAT USERS",res?.data?.data)

    const apiUsers = res?.data?.data || [];
    setUsers(apiUsers);

    // Load status for each real user
    apiUsers.forEach(async (user) => {
      await loadUserStatus(user._id);
    });

  } catch (err) {
    console.error("❌ Failed to load users:", err);
    showToast("Failed to load users", "error");
    // setUsers([]); // NO dummy fallback
  }
};


  const loadMessages = async (conversationId) => {
    setLoading(true);
    try {
      console.log("💬 Loading messages for:", conversationId);
      const res = await getMessagesAPI();
      console.log("✅ Messages loaded:", res.data);
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("❌ Load messages error:", err);
      showToast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadNotifications = async () => {
    try {
      console.log("🔔 Loading notifications...");
      const res = await getUnreadNotificationsAPI();
      console.log("✅ Notifications loaded:", res.data);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("❌ Load notifications error:", err);
    }
  };

  const markUserOnline = async () => {
    try {
      console.log("🟢 Marking user as online...");
      await updateUserStatusAPI("online");
      if (socket && socketConnected) {
        socket.emit("updateStatus", { status: "online" });
      }
      console.log("✅ User marked as online");
    } catch (error) {
      console.error("❌ Failed to update status:", error);
    }
  };

  const loadUserStatus = async (userId) => {
    try {
      const res = await getUserStatusAPI(userId);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: res.data.data || { status: "offline" },
      }));
    } catch (error) {
      console.error(`❌ Failed to get status for user ${userId}:`, error);
      setUserStatus((prev) => ({
        ...prev,
        [userId]: { status: "offline" },
      }));
    }
  };

  const handleMarkMessagesAsRead = async (conversationId) => {
    if (!socket) return;
    try {
      console.log("👁️ Marking messages as read:", conversationId);
      await markMessagesReadAPI(conversationId);
      socket.emit("messageRead", { conversationId });
    } catch (error) {
      console.error("❌ Failed to mark as read:", error);
    }
  };

  const handleMarkMessageAsDelivered = async (messageId) => {
    if (!socket) return;
    try {
      console.log("📬 Marking message as delivered:", messageId);
      await markMessageDeliveredAPI(messageId);
      socket.emit("messageDelivered", { messageId });
    } catch (error) {
      console.error("❌ Failed to mark as delivered:", error);
    }
  };

  const handleMarkNotificationsAsRead = async () => {
    try {
      console.log("🔕 Marking notifications as read...");
      await markNotificationsReadAPI();
      setNotifications([]);
      showToast("Notifications cleared", "success");
    } catch (err) {
      console.error("❌ Mark notifications error:", err);
      showToast("Failed to clear notifications", "error");
    }
  };

  const getFileIcon = (file) => {
    const type = file.type;
    if (type.includes("presentation")) return "📊";
    if (type.includes("spreadsheet")) return "📈";
    if (type.includes("word")) return "📄";
    if (type === "application/pdf") return "📕";
    if (type.startsWith("audio")) return "🎵";
    if (type.startsWith("video")) return "🎬";
    return "📁";
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("File too large (max 50MB)", "error");
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("file");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!socketConnected) {
      showToast("Not connected to server", "error");
      return;
    }

    if (!selectedConversation) {
      showToast("Please select a conversation", "warning");
      return;
    }

    if (!newMessage.trim() && !selectedFile) {
      showToast("Type a message or attach a file", "warning");
      return;
    }

    const receiverId = selectedConversation.participants.find(
      (p) => p._id !== userId
    )?._id;

    if (!receiverId) {
      showToast("Invalid receiver", "error");
      return;
    }

    if (receiverId.startsWith("dummy")) {
      showToast("Cannot send messages to demo users", "info");
      return;
    }

    let attachments = [];
    let type = "text";

    try {
      if (selectedFile) {
        console.log("📎 Uploading file:", selectedFile.name);
        setUploading(true);

        // Determine message type
        if (selectedFile.type.startsWith("image/")) type = "image";
        else if (selectedFile.type.startsWith("video/")) type = "video";
        else if (selectedFile.type.startsWith("audio/")) type = "audio";
        else if (
          selectedFile.type === "application/pdf" ||
          selectedFile.type.includes("word") ||
          selectedFile.type.includes("document") ||
          selectedFile.type.includes("spreadsheet") ||
          selectedFile.type.includes("presentation")
        )
          type = "document";
        else type = "file";

        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await sendChatMessageAPI(formData, (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          console.log(`📤 Upload progress: ${percent}%`);
        });

        console.log("✅ Upload successful:", uploadRes.data);
        attachments = [uploadRes.data];
        showToast("File uploaded successfully", "success");
      }

      console.log("📤 Sending message via socket");
      socket.emit(
        "sendMessage",
        {
          receiverId,
          content: newMessage || "",
          type,
          attachments,
          conversationId: ""
        },
        (response) => {
          if (response?.error) {
            console.error("❌ Message send error:", response.error);
            showToast(response.error, "error");
          } else {
            console.log("✅ Message sent successfully:", response);
          }
        }
      );

      console.log("🟡 About to emit sendMessage", {
  receiverId,
  content: newMessage,
  type,
  attachments,
  socketConnected: socket.connected,
});





      // Clear form
      setNewMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsTyping(false);
    } catch (err) {
      console.error("❌ Send message error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to send message";
      showToast(errorMsg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedConversation || !selectedConversation._id) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId: selectedConversation._id,
        isTyping: true,
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", {
        conversationId: selectedConversation._id,
        isTyping: false,
      });
    }, 2000);
  };

  const selectConversation = (conversation) => {
    console.log("📂 Selecting conversation:", conversation);
    setSelectedConversation(conversation);

    if (conversation._id && socket) {
      loadMessages(conversation._id);
      socket.emit("joinRoom", conversation._id);
      handleMarkMessagesAsRead(conversation._id);
    } else {
      setMessages([]);
    }
  };

  const showToast = (message, type = "info") => {
    console.log(`🔔 Toast [${type}]:`, message);
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
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
        <NotificationBadge
          count={notifications.length}
          onClick={handleMarkNotificationsAsRead}
        />
      </header>

      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Sidebar */}
        <aside className="w-80 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
          {/* Conversations */}
          <div className="border-b border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200">
              <h2 className="text-lg font-bold text-gray-800">
                💬 Conversations
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto max-h-64">
              {conversations.length === 0 ? (
                <EmptyState
                  icon="📭"
                  title="No conversations"
                  description="Start a new chat!"
                />
              ) : (
                conversations.map((conv) => (
                  <ConversationItem
                    key={conv._id}
                    conversation={conv}
                    isActive={selectedConversation?._id === conv._id}
                    unreadCount={conv.unreadCount}
                    onClick={() => selectConversation(conv)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Online Users */}
          <div className="flex-1">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-green-200">
              <h2 className="text-lg font-bold text-gray-800">
                👥 Connected Workers
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {users.length === 0 ? (
                <EmptyState
                  icon="🚫"
                  title="No users"
                  description="No other users online"
                />
              ) : (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    status={userStatus[user._id] || { status: "offline" }}
                    onClick={() =>
                      selectConversation({
                        participants: [user],
                      })
                    }
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
          {selectedConversation &&
          selectedConversation.participants.length > 0 ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedConversation.displayName ||
                      selectedConversation.participants[0]?.username}
                  </h2>
                </div>
                <UserStatusIndicator
                  status={
                    userStatus[selectedConversation.participants[0]?._id]
                      ?.status || "offline"
                  }
                />
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
                        key={msg._id}
                        message={msg}
                        isSent={msg.senderId._id === userId}
                        onDelivered={handleMarkMessageAsDelivered}
                      />
                    ))}
                    {typingUser && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t p-3 flex flex-col gap-2">
                {selectedFile && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 w-fit">
                    {previewUrl &&
                      previewUrl !== "file" &&
                      selectedFile.type.startsWith("image") && (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-24 rounded-lg"
                        />
                      )}

                    {selectedFile.type === "application/pdf" && (
                      <iframe
                        src={previewUrl}
                        className="w-40 h-32 border rounded"
                        title="PDF Preview"
                      />
                    )}

                    {!selectedFile.type.startsWith("image") &&
                      selectedFile.type !== "application/pdf" && (
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">
                            {getFileIcon(selectedFile)}
                          </span>
                          <div>
                            <p className="text-sm font-medium">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="fileInput"
                    hidden
                    onChange={handleFileSelect}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("fileInput").click()
                    }
                    className="text-xl px-2 hover:bg-gray-100 rounded"
                    disabled={uploading}
                  >
                    📎
                  </button>

                  <input
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder={
                      socketConnected
                        ? "Type a message"
                        : "Connecting to server..."
                    }
                    disabled={!socketConnected || uploading}
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={sendMessage}
                    disabled={uploading || !socketConnected}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? "⏳" : "➤"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              icon="👈"
              title="Select a conversation"
              description="Choose a chat to start messaging"
            />
          )}
        </main>
      </div>

      {/* Toast Notification */}
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

// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import {
//   MessageBubble,
//   TypingIndicator,
//   UserStatusIndicator,
//   NotificationBadge,
//   ConversationItem,
//   UserListItem,
//   EmptyState,
//   LoadingSpinner,
//   Toast,
// } from "./ChatModule";
// import { getAccessToken } from "../../utils/APIs/commonHeadApiLogic";
// import {
//   GetChatUsersAPI,
//   getConversationsAPI,
//   getMessagesAPI,
//   getUnreadNotificationsAPI,
//   markNotificationsReadAPI,
//   uploadChatFileAPI,
// } from "../../utils/APIs/chatAPIs";

// const BASE_URL = process.env.REACT_APP_HIRE_ROOFER_WEBSITE_BASE_API_URL;

// export default function ChatApp() {
//   // State Management
//   const [socket, setSocket] = useState(null);
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [users, setUsers] = useState([]);
//   const [userStatus, setUserStatus] = useState({});
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingUser, setTypingUser] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [socketConnected, setSocketConnected] = useState(false);

//   const typingTimeoutRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const userId = localStorage.getItem("userId");

//   const DUMMY_USERS = [
//     { _id: "dummy-1", username: "Alice Bot", avatar: null },
//     { _id: "dummy-2", username: "Bob Tester", avatar: null },
//     { _id: "dummy-3", username: "Charlie Demo", avatar: null },
//   ];

//   // Initialize Socket Connection
//   useEffect(() => {
//     if (!BASE_URL) {
//       console.error("❌ BASE_URL not configured");
//       showToast("Configuration error: BASE_URL missing", "error");
//       return;
//     }

//     const token = getAccessToken();
//     if (!token) {
//       console.error("❌ No authentication token available");
//       showToast("Please log in to use chat", "error");
//       return;
//     }

//     console.log("🔌 Initializing socket connection...");
//     const newSocket = io(BASE_URL, {
//       auth: { token },
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionAttempts: 5,
//     });

//     setSocket(newSocket);

//     return () => {
//       console.log("🔌 Disconnecting socket...");
//       newSocket.disconnect();
//     };
//   }, []);

//   // Setup Socket Listeners
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket.id);
//       setSocketConnected(true);
//       showToast("Connected to chat server", "success");
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Socket connection error:", err.message);
//       setSocketConnected(false);
//       showToast("Connection error. Retrying...", "error");
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("🔌 Socket disconnected:", reason);
//       setSocketConnected(false);
//       showToast("Disconnected from chat server", "warning");
//     });

//     // User Status Events
//     socket.on("userOnline", ({ userId }) => {
//       console.log(`👤 User ${userId} is online`);
//       setUserStatus((prev) => ({
//         ...prev,
//         [userId]: { status: "online" },
//       }));
//     });

//     socket.on("userOffline", ({ userId }) => {
//       console.log(`👤 User ${userId} is offline`);
//       setUserStatus((prev) => ({
//         ...prev,
//         [userId]: { status: "offline" },
//       }));
//     });

//     socket.on("userStatusChanged", ({ userId, status }) => {
//       console.log(`👤 User ${userId} status changed to ${status}`);
//       setUserStatus((prev) => ({
//         ...prev,
//         [userId]: { status },
//       }));
//     });

//     // Message Events
//     socket.on("newMessage", (message) => {
//       console.log("📨 New message received:", message);
//       setMessages((prev) => [...prev, message]);
//       if (message._id) {
//         markMessageAsDelivered(message._id);
//       }
//       loadConversations();
//     });

//     socket.on("newMessageNotification", ({ from, message }) => {
//       showToast(`New message from ${from}`, "info");
//       loadUnreadNotifications();
//     });

//     // Typing Events
//     socket.on("userTyping", ({ userId, isTyping }) => {
//       console.log(`⌨️ User ${userId} typing:`, isTyping);
//       setTypingUser(isTyping ? userId : null);
//     });

//     // Delivery & Read Events
//     socket.on("deliveryStatusUpdate", ({ messageId, status }) => {
//       console.log(`📬 Message ${messageId} delivery status:`, status);
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg._id === messageId ? { ...msg, deliveryStatus: status } : msg
//         )
//       );
//     });

//     socket.on("readStatusUpdate", ({ conversationId, readBy }) => {
//       console.log(`👁️ ${readBy} read messages in ${conversationId}`);
//     });

//     // Room Events
//     socket.on("userJoinedRoom", ({ userId, conversationId }) => {
//       console.log(`🚪 User ${userId} joined room ${conversationId}`);
//     });

//     socket.on("userLeftRoom", ({ userId, conversationId }) => {
//       console.log(`🚪 User ${userId} left room ${conversationId}`);
//     });

//     socket.on("messageError", ({ error }) => {
//       console.error("❌ Message error:", error);
//       showToast(`Error: ${error}`, "error");
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("connect_error");
//       socket.off("disconnect");
//       socket.off("userOnline");
//       socket.off("userOffline");
//       socket.off("userStatusChanged");
//       socket.off("newMessage");
//       socket.off("newMessageNotification");
//       socket.off("userTyping");
//       socket.off("deliveryStatusUpdate");
//       socket.off("readStatusUpdate");
//       socket.off("userJoinedRoom");
//       socket.off("userLeftRoom");
//       socket.off("messageError");
//     };
//   }, [socket]);

//   // Initialize App Data
//   useEffect(() => {
//     if (socketConnected) {
//       setupApp();
//     }
//   }, [socketConnected]);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, typingUser]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const setupApp = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         loadConversations(),
//         loadUsers(),
//         loadUnreadNotifications(),
//         markUserOnline(),
//       ]);
//     } catch (error) {
//       console.error("Setup error:", error);
//       showToast("Failed to initialize app", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // API Calls
//   const loadConversations = async () => {
//     try {
//       const res = await getConversationsAPI();
//       setConversations(res.data.data || []);
//     } catch (err) {
//       console.error("Load conversations error:", err);
//       showToast("Failed to load conversations", "error");
//     }
//   };

//   const loadUsers = async () => {
//     try {
//       const res = await GetChatUsersAPI();
//       const apiUsers = res.data?.data || [];
//       const mergedUsers = [...apiUsers, ...DUMMY_USERS];

//       setUsers(mergedUsers);

//       mergedUsers.forEach((user) => {
//         if (user._id.startsWith("dummy")) {
//           setUserStatus((prev) => ({
//             ...prev,
//             [user._id]: { status: "offline" },
//           }));
//         } else {
//           getUserStatus(user._id);
//         }
//       });
//     } catch (err) {
//       console.error("Users API failed, loading dummy users:", err);
//       setUsers(DUMMY_USERS);
//       DUMMY_USERS.forEach((user) => {
//         setUserStatus((prev) => ({
//           ...prev,
//           [user._id]: { status: "offline" },
//         }));
//       });
//     }
//   };

//   const loadMessages = async (conversationId) => {
//     setLoading(true);
//     try {
//       const res = await getMessagesAPI(conversationId);
//       setMessages(res.data.data || []);
//     } catch (err) {
//       console.error("Load messages error:", err);
//       showToast("Failed to load messages", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUnreadNotifications = async () => {
//     try {
//       const res = await getUnreadNotificationsAPI();
//       setNotifications(res.data.data || []);
//     } catch (err) {
//       console.error("Load notifications error:", err);
//     }
//   };

//   const markUserOnline = async () => {
//     if (!socket || !socketConnected) return;
//     try {
//       socket.emit("updateStatus", { status: "online" });
//     } catch (error) {
//       console.error("Failed to update status:", error);
//     }
//   };

//   const getUserStatus = async (userId) => {
//     // This would typically be an API call
//     // For now, we rely on socket events
//     setUserStatus((prev) => ({
//       ...prev,
//       [userId]: prev[userId] || { status: "offline" },
//     }));
//   };

//   const markMessagesAsRead = async (conversationId) => {
//     if (!socket) return;
//     try {
//       socket.emit("messageRead", { conversationId });
//     } catch (error) {
//       console.error("Failed to mark as read:", error);
//     }
//   };

//   const markMessageAsDelivered = async (messageId) => {
//     if (!socket) return;
//     try {
//       socket.emit("messageDelivered", { messageId });
//     } catch (error) {
//       console.error("Failed to mark as delivered:", error);
//     }
//   };

//   const markNotificationsAsRead = async () => {
//     try {
//       await markNotificationsReadAPI();
//       setNotifications([]);
//       showToast("Notifications cleared", "success");
//     } catch (err) {
//       console.error("Mark notifications error:", err);
//     }
//   };

//   const getFileIcon = (file) => {
//     const type = file.type;
//     if (type.includes("presentation")) return "📊";
//     if (type.includes("spreadsheet")) return "📈";
//     if (type.includes("word")) return "📄";
//     if (type === "application/pdf") return "📕";
//     if (type.startsWith("audio")) return "🎵";
//     if (type.startsWith("video")) return "🎬";
//     return "📁";
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file size (50MB)
//     const maxSize = 50 * 1024 * 1024;
//     if (file.size > maxSize) {
//       showToast("File too large (max 50MB)", "error");
//       return;
//     }

//     setSelectedFile(file);

//     if (file.type.startsWith("image/") || file.type === "application/pdf") {
//       setPreviewUrl(URL.createObjectURL(file));
//     } else {
//       setPreviewUrl("file");
//     }
//   };

//   const sendMessage = async (e) => {
//     e.preventDefault();

//     if (!socketConnected) {
//       showToast("Not connected to server", "error");
//       return;
//     }

//     if (!selectedConversation) {
//       showToast("Please select a conversation", "warning");
//       return;
//     }

//     if (!newMessage.trim() && !selectedFile) {
//       showToast("Type a message or attach a file", "warning");
//       return;
//     }

//     const receiverId = selectedConversation.participants.find(
//       (p) => p._id !== userId
//     )?._id;

//     if (!receiverId) {
//       showToast("Invalid receiver", "error");
//       return;
//     }

//     if (receiverId.startsWith("dummy")) {
//       showToast("Cannot send messages to demo users", "info");
//       return;
//     }

//     let attachments = [];
//     let type = "text";

//     try {
//       if (selectedFile) {
//         console.log("📎 Uploading file:", selectedFile.name);
//         setUploading(true);

//         // Determine message type
//         if (selectedFile.type.startsWith("image/")) type = "image";
//         else if (selectedFile.type.startsWith("video/")) type = "video";
//         else if (selectedFile.type.startsWith("audio/")) type = "audio";
//         else if (
//           selectedFile.type === "application/pdf" ||
//           selectedFile.type.includes("word") ||
//           selectedFile.type.includes("document") ||
//           selectedFile.type.includes("spreadsheet") ||
//           selectedFile.type.includes("presentation")
//         )
//           type = "document";
//         else type = "file";

//         const formData = new FormData();
//         formData.append("file", selectedFile);

//         const uploadRes = await uploadChatFileAPI(formData, (e) => {
//           const percent = Math.round((e.loaded * 100) / e.total);
//           console.log(`Upload ${percent}%`);
//         });

//         console.log("✅ Upload successful:", uploadRes.data);
//         attachments = [uploadRes.data];
//         showToast("File uploaded successfully", "success");
//       }

//       console.log("📤 Sending message via socket");
//       socket.emit(
//         "sendMessage",
//         {
//           receiverId,
//           content: newMessage || "",
//           type,
//           attachments,
//         },
//         (response) => {
//           if (response?.error) {
//             showToast(response.error, "error");
//           } else {
//             console.log("✅ Message sent:", response);
//           }
//         }
//       );

//       // Clear form
//       setNewMessage("");
//       setSelectedFile(null);
//       setPreviewUrl(null);
//       setIsTyping(false);
//     } catch (err) {
//       console.error("❌ Send message error:", err);
//       const errorMsg =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         "Failed to send message";
//       showToast(errorMsg, "error");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);

//     if (!socket || !selectedConversation) return;

//     if (!isTyping) {
//       setIsTyping(true);
//       socket.emit("typing", {
//         conversationId: selectedConversation._id,
//         isTyping: true,
//       });
//     }

//     clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false);
//       socket.emit("typing", {
//         conversationId: selectedConversation._id,
//         isTyping: false,
//       });
//     }, 2000);
//   };

//   const selectConversation = (conversation) => {
//     setSelectedConversation(conversation);

//     if (conversation._id && socket) {
//       loadMessages(conversation._id);
//       socket.emit("joinRoom", conversation._id);
//       markMessagesAsRead(conversation._id);
//     } else {
//       setMessages([]);
//     }
//   };

//   const showToast = (message, type = "info") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg p-4 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <span className="text-3xl">💬</span>
//           <h1 className="text-2xl font-bold">Chat</h1>
//           {socketConnected ? (
//             <span className="text-xs bg-green-500 px-2 py-1 rounded-full">
//               Connected
//             </span>
//           ) : (
//             <span className="text-xs bg-red-500 px-2 py-1 rounded-full">
//               Disconnected
//             </span>
//           )}
//         </div>
//         <NotificationBadge
//           count={notifications.length}
//           onClick={markNotificationsAsRead}
//         />
//       </header>

//       <div className="flex flex-1 overflow-hidden gap-4 p-4">
//         {/* Sidebar */}
//         <aside className="w-80 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
//           {/* Conversations */}
//           <div className="border-b border-gray-200">
//             <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200">
//               <h2 className="text-lg font-bold text-gray-800">
//                 💬 Conversations
//               </h2>
//             </div>
//             <div className="flex-1 overflow-y-auto max-h-64">
//               {conversations.length === 0 ? (
//                 <EmptyState
//                   icon="📭"
//                   title="No conversations"
//                   description="Start a new chat!"
//                 />
//               ) : (
//                 conversations.map((conv) => (
//                   <ConversationItem
//                     key={conv._id}
//                     conversation={conv}
//                     isActive={selectedConversation?._id === conv._id}
//                     unreadCount={conv.unreadCount}
//                     onClick={() => selectConversation(conv)}
//                   />
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Online Users */}
//           <div className="flex-1">
//             <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-green-200">
//               <h2 className="text-lg font-bold text-gray-800">
//                 👥 Online Users
//               </h2>
//             </div>
//             <div className="flex-1 overflow-y-auto p-2 space-y-1">
//               {users.length === 0 ? (
//                 <EmptyState
//                   icon="🚫"
//                   title="No users"
//                   description="No other users online"
//                 />
//               ) : (
//                 users.map((user) => (
//                   <UserListItem
//                     key={user._id}
//                     user={user}
//                     status={userStatus[user._id] || { status: "offline" }}
//                     onClick={() =>
//                       selectConversation({
//                         participants: [user],
//                       })
//                     }
//                   />
//                 ))
//               )}
//             </div>
//           </div>
//         </aside>

//         {/* Main Chat Area */}
//         <main className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
//           {selectedConversation &&
//           selectedConversation.participants.length > 0 ? (
//             <>
//               {/* Chat Header */}
//               <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex justify-between items-center">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">
//                     {selectedConversation.name ||
//                       selectedConversation.participants[0]?.username}
//                   </h2>
//                 </div>
//                 <UserStatusIndicator
//                   status={
//                     userStatus[selectedConversation.participants[0]?._id]
//                       ?.status || "offline"
//                   }
//                 />
//               </div>

//               {/* Messages List */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//                 {loading ? (
//                   <LoadingSpinner />
//                 ) : messages.length === 0 ? (
//                   <EmptyState
//                     icon="👋"
//                     title="No messages yet"
//                     description="Start the conversation!"
//                   />
//                 ) : (
//                   <>
//                     {messages.map((msg) => (
//                       <MessageBubble
//                         key={msg._id}
//                         message={msg}
//                         isSent={msg.senderId._id === userId}
//                         onDelivered={markMessageAsDelivered}
//                       />
//                     ))}
//                     {typingUser && <TypingIndicator />}
//                     <div ref={messagesEndRef} />
//                   </>
//                 )}
//               </div>

//               {/* Message Input */}
//               <form
//                 onSubmit={sendMessage}
//                 className="border-t p-3 flex flex-col gap-2"
//               >
//                 {selectedFile && (
//                   <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 w-fit">
//                     {previewUrl &&
//                       previewUrl !== "file" &&
//                       selectedFile.type.startsWith("image") && (
//                         <img
//                           src={previewUrl}
//                           alt="Preview"
//                           className="w-24 rounded-lg"
//                         />
//                       )}

//                     {selectedFile.type === "application/pdf" && (
//                       <iframe
//                         src={previewUrl}
//                         className="w-40 h-32 border rounded"
//                         title="PDF Preview"
//                       />
//                     )}

//                     {!selectedFile.type.startsWith("image") &&
//                       selectedFile.type !== "application/pdf" && (
//                         <div className="flex items-center gap-2">
//                           <span className="text-3xl">
//                             {getFileIcon(selectedFile)}
//                           </span>
//                           <div>
//                             <p className="text-sm font-medium">
//                               {selectedFile.name}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSelectedFile(null);
//                         setPreviewUrl(null);
//                       }}
//                       className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 )}

//                 <div className="flex items-center gap-2">
//                   <input
//                     type="file"
//                     id="fileInput"
//                     hidden
//                     onChange={handleFileSelect}
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       document.getElementById("fileInput").click()
//                     }
//                     className="text-xl px-2 hover:bg-gray-100 rounded"
//                     disabled={uploading}
//                   >
//                     📎
//                   </button>

//                   <input
//                     value={newMessage}
//                     onChange={handleInputChange}
//                     placeholder={
//                       socketConnected
//                         ? "Type a message"
//                         : "Connecting to server..."
//                     }
//                     disabled={!socketConnected || uploading}
//                     className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />

//                   <button
//                     type="submit"
//                     disabled={uploading || !socketConnected}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//                   >
//                     {uploading ? "⏳" : "➤"}
//                   </button>
//                 </div>
//               </form>
//             </>
//           ) : (
//             <EmptyState
//               icon="👈"
//               title="Select a conversation"
//               description="Choose a chat to start messaging"
//             />
//           )}
//         </main>
//       </div>

//       {/* Toast Notification */}
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// }
