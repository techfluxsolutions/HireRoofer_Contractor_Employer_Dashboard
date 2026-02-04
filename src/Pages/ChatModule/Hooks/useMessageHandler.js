// ============================================
// FILE: hooks/useMessageHandler.js
// ============================================

import { useState, useRef, useCallback, useEffect } from "react";
import {
  markMessageDeliveredAPI,
  markMessagesReadAPI,
  sendChatMessageAPI,
} from "../../../utils/APIs/chatAPIs";

export const useMessageHandler = (
  socket,
  socketConnected,
  selectedConversation,
  messageLength,
  userId,
  onToast
) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  /* ================= JOIN ROOM ================= */
  useEffect(() => {
    if (
      socket &&
      selectedConversation?.type === "individual" &&
      selectedConversation?.conversationId
    ) {
      socket.emit("joinConversation", selectedConversation.conversationId);
    }
  }, [socket, selectedConversation]);

  /* ================= READ / DELIVER ================= */
  const handleMarkMessagesAsRead = useCallback(
    async (conversationId) => {
      if (!socket || !conversationId) return;
      try {
        await markMessagesReadAPI(conversationId);
        socket.emit("messageRead", { conversationId });
      } catch (err) {
        console.error("❌ Read error", err);
      }
    },
    [socket]
  );

  const handleMarkMessageAsDelivered = useCallback(
    async (messageId) => {
      if (!socket || !messageId) return;
      try {
        await markMessageDeliveredAPI(messageId);
        socket.emit("messageDelivered", { messageId });
      } catch (err) {
        console.error("❌ Delivered error", err);
      }
    },
    [socket]
  );

  /* ================= FILE ================= */
  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        onToast?.("File too large (max 50MB)", "error");
        return;
      }

      setSelectedFile(file);

      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl("file");
      }
    },
    [onToast]
  );

  /* ================= SEND MESSAGE ================= */
  const sendMessage = useCallback(
    async (e) => {
      e.preventDefault();

      if (!socketConnected) {
        onToast?.("Not connected to server", "error");
        return;
      }

      if (!selectedConversation) {
        onToast?.("Select a user or conversation", "warning");
        return;
      }

      if (!newMessage.trim() && !selectedFile) {
        onToast?.("Type a message or attach a file", "warning");
        return;
      }

      const isUser = selectedConversation?.participants?.[0]?.type === "user";
      const isConversation = selectedConversation?.participants?.[0]?.type === "individual";

      const receiverId =
        selectedConversation?.participants?.[0]?.recieverId || null;

      const conversationId = selectedConversation?.participants?.[0]?.conversationId || null;

      if (isUser && !receiverId) {
        onToast?.("Receiver not found", "error");
        return;
      }

      if (isConversation && !conversationId) {
        onToast?.("Conversation not found", "error");
        return;
      }

      try {
        setUploading(true);

        const type = selectedFile ? "file" : "text";
        const formData = new FormData();

        formData.append("content", newMessage || "");
        formData.append("type", type);

        if (selectedFile) {
          formData.append("attachments", selectedFile);
        }

        /* ===== PAYLOAD LOGIC ===== */
        if (isConversation) {
          formData.append("conversationId", conversationId);
        } 
        // else {
        //   formData.append("receiverId", receiverId);
        // }
        formData.append("receiverId", selectedConversation?.participants?.[0]?.otherParticipantId);

        await sendChatMessageAPI(formData);

        /* ===== SOCKET EMIT ===== */
        socket.emit(
          "sendMessage",
          {
            content: newMessage || "",
            type,
            conversationId: isConversation ? conversationId : null,
            // receiverId: isUser ? receiverId : null,
            receiverId:selectedConversation?.participants?.[0]?.otherParticipantId,
          
          },
          (res) => {
            if (res?.error) {
              onToast?.(res.error, "error");
            }
          }
        );

        setNewMessage("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsTyping(false);
      } catch (err) {
        console.error("❌ Send message error", err);
        onToast?.("Failed to send message", "error");
      } finally {
        setUploading(false);
      }
    },
    [
      socketConnected,
      socket,
      selectedConversation,
      newMessage,
      selectedFile,
      onToast,
    ]
  );

  /* ================= TYPING ================= */
  const handleInputChange = useCallback(
    (e) => {
      setNewMessage(e.target.value);

      if (
        !socket ||
        selectedConversation?.type !== "individual" ||
        !selectedConversation?.conversationId
      )
        return;

      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", {
          conversationId: selectedConversation.conversationId,
          isTyping: true,
        });
      }

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("typing", {
          conversationId: selectedConversation.conversationId,
          isTyping: false,
        });
      }, 2000);
    },
    [socket, selectedConversation, isTyping]
  );

  return {
    newMessage,
    selectedFile,
    previewUrl,
    uploading,
    isTyping,
    setNewMessage,
    setSelectedFile,
    setPreviewUrl,
    handleFileSelect,
    sendMessage,
    handleInputChange,
    handleMarkMessagesAsRead,
    handleMarkMessageAsDelivered,
  };
};




// // ============================================
// // FILE: hooks/useMessageHandler.js
// // ============================================
// import { useState, useRef, useCallback, useEffect } from 'react';
// import { markMessageDeliveredAPI, markMessagesReadAPI, sendChatMessageAPI } from '../../../utils/APIs/chatAPIs';

// export const useMessageHandler = (
//   socket,
//   socketConnected,
//   selectedConversation,
//   messageLength,
//   userId,
//   onToast
// ) => {
//   const [newMessage, setNewMessage] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
// console.log("MESSAGE HANDLER LENGTH",messageLength)
//   const typingTimeoutRef = useRef(null);
// console.log("selectedConversation_____",selectedConversation?.participants?. [0] ?.recieverId)

//   useEffect(() => {
//   if (socket && selectedConversation?._id) {
//     socket.emit("joinConversation", selectedConversation?.conversationId);
//   }
// }, [socket, selectedConversation]);

  

//   const handleMarkMessagesAsRead = useCallback(async (conversationId) => {
//     if (!socket) return;
//     try {
//       console.log('👁️ Marking messages as read:', conversationId);
//       await markMessagesReadAPI(conversationId);
//       socket.emit('messageRead', { conversationId });
//     } catch (error) {
//       console.error('❌ Failed to mark as read:', error);
//     }
//   }, [socket]);

//   const handleMarkMessageAsDelivered = useCallback(async (messageId) => {
//     if (!socket) return;
//     try {
//       console.log('📬 Marking message as delivered:', messageId);
//       await markMessageDeliveredAPI(messageId);
//       socket.emit('messageDelivered', { messageId });
//     } catch (error) {
//       console.error('❌ Failed to mark as delivered:', error);
//     }
//   }, [socket]);

//   const handleFileSelect = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const maxSize = 50 * 1024 * 1024;
//     if (file.size > maxSize) {
//       onToast?.('File too large (max 50MB)', 'error');
//       return;
//     }

//     setSelectedFile(file);

//     if (file.type.startsWith('image/') || file.type === 'application/pdf') {
//       setPreviewUrl(URL.createObjectURL(file));
//     } else {
//       setPreviewUrl('file');
//     }
//   }, [onToast]);

//   const sendMessage = useCallback(async (e) => {
//     e.preventDefault();



//     console.log("selectedConversation...", selectedConversation)

//     console.log("<MessageLength>",messageLength)

//     if (!socketConnected) {
//       onToast?.('Not connected to server', 'error');
//       return;
//     }

//     if (!selectedConversation) {
//       onToast?.('Please select a conversation', 'warning');
//       return;
//     }

//     if (!newMessage.trim() && !selectedFile) {
//       onToast?.('Type a message or attach a file', 'warning');
//       return;
//     }

//     // const receiverId = selectedConversation.participants.find(
//     //   (p) => p._id !== userId
//     // )?._id;

//     const receiverId = selectedConversation?.participants?._id
//     console.log("receiversId", receiverId)

//     if (!receiverId) {
//       onToast?.('Invalid receiver', 'error');
//       return;
//     }

//     let attachments = [];
//     let type = 'text';

//     try {
//    setUploading(true);

//   let type = 'text';

//   if (selectedFile) {
//     if (selectedFile.type.startsWith('image/')) type = 'file';
//     else if (selectedFile.type.startsWith('video/')) type = 'file';
//     else if (selectedFile.type.startsWith('audio/')) type = 'file';
//     else type = 'file';
//   }

//   const formData = new FormData();
//   formData.append('content', newMessage || '');
//   formData.append('type', type);

//   // ✅ SAME LOGIC FOR BOTH TEXT & FILE
//   if (messageLength > 0) {
//     formData.append(
//       'conversationId',
//       selectedConversation?.participants?._id || ''
//     );
//   } else {
//     formData.append(
//       'receiverId',
//       receiverId || ''
//     );
//   }

//   // ✅ Only append file if exists
//   if (selectedFile) {
//     formData.append('attachments', selectedFile);
//   }

//   const res = await sendChatMessageAPI(formData, (e) => {
//     const percent = Math.round((e.loaded * 100) / e.total);
//     console.log(`📤 Upload progress: ${percent}%`);
//   });

//   console.log('✅ Message API success:', res.data);

//       console.log('📤 Sending message via socket');
//       socket.emit(
//         'sendMessage',
//         {
//           receiverId,
//           content: newMessage || '',
//           type,
//           attachments,
//           conversationId: '',
//         },
//         (response) => {
//           if (response?.error) {
//             console.error('❌ Message send error:', response.error);
//             onToast?.(response.error, 'error');
//           } else {
//             console.log('✅ Message sent successfully:', response);
//           }
//         }
//       );

//       setNewMessage('');
//       setSelectedFile(null);
//       setPreviewUrl(null);
//       setIsTyping(false);
//     } catch (err) {
//       console.error('❌ Send message error:', err);
//       const errorMsg =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         'Failed to send message';
//       onToast?.(errorMsg, 'error');
//     } finally {
//       setUploading(false);
//     }
//   }, [
//     socketConnected,
//     selectedConversation,
//     newMessage,
//     selectedFile,
//     socket,
//     userId,
//     onToast,
//   ]);

//   const handleInputChange = useCallback((e) => {
//     setNewMessage(e.target.value);
//     console.log("HELLO..")
//     if (!socket || !selectedConversation || !selectedConversation._id) return;

//     if (!isTyping) {
//       setIsTyping(true);
//       socket.emit('typing', {
//         conversationId: selectedConversation._id,
//         isTyping: true,
//       });
//     }

//     clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false);
//       socket.emit('typing', {
//         conversationId: selectedConversation._id,
//         isTyping: false,
//       });
//     }, 2000);
//   }, [socket, selectedConversation, isTyping]);

//   return {
//     newMessage,
//     selectedFile,
//     previewUrl,
//     uploading,
//     isTyping,
//     setNewMessage,
//     setSelectedFile,
//     setPreviewUrl,
//     handleFileSelect,
//     sendMessage,
//     handleInputChange,
//     handleMarkMessagesAsRead,
//     handleMarkMessageAsDelivered,
//   };
// };