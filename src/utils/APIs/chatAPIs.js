// api/chatAPIs.js
import { axiosInstance, authorizeMe } from "./commonHeadApiLogic.js";

/**
 * Wrapper to ensure authorization header is set before API calls
 */
const withAuthorization = async (apiFunction) => {
  try {
    // Ensure authorization header is set
    authorizeMe();
    // Execute the API function
    return await apiFunction();
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
};

/**
 * Get list of users for chat
 */
export async function GetChatUsersAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/api/chat/users");
    console.log("RESPONSE",response)
    return response
  });
}

/**
 * Get all conversations for current user
 */
export async function getConversationsAPI() {
  return withAuthorization(async () => {
     const response =await axiosInstance.get("/api/chat/conversations");
     return response
  });
}

/**
 * Get messages for a specific conversation
 * @param {string} conversationId - The conversation ID
 */
export async function getMessagesAPI(conversationId) {
  return withAuthorization(async () => {
     const response = await axiosInstance.get(`/api/chat/messages/${conversationId}`);
     return response
  });
}

/**
 * Get unread notifications
 */
export async function getUnreadNotificationsAPI() {
  return withAuthorization(async () => {
     const response = await axiosInstance.get("/api/chat/notifications/unread");
     return response
  });
}

/**
 * Mark all notifications as read
 */
export async function markNotificationsReadAPI() {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/chat/notifications/mark-read");
  });
}

// /**
//  * Upload a file for chat
//  * @param {FormData} formData - The file to upload
//  * @param {function} onUploadProgress - Progress callback
//  */
// chatAPIs.js
export async function sendChatMessageAPI(formData, onUploadProgress) {
  // const role=sessionStorage.getItem("userRole")
  return withAuthorization(async () => {
    return await axiosInstance.post(`/api/chat/messages/individual`,formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      }
    );
  });
}


/**
 * Update user status (online/offline/away)
 * @param {string} status - The status to set
 */
export async function updateUserStatusAPI(status) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/chat/status/update", { status });
  });
}

/**
 * Get status of a specific user
 * @param {string} userId - The user ID
 */
export async function getUserStatusAPI(userId) {
  return withAuthorization(async () => {
    const response = await axiosInstance.get(`/api/chat/status/${userId}`);
    return response
  });
}

/**
 * Mark messages as read
 * @param {string} conversationId - The conversation ID
 */
export async function markMessagesReadAPI(conversationId) {
  return withAuthorization(async () => {
     const response = await axiosInstance.post("/api/chat/messages/read", { 
      conversationId 
    });
  });
}

/**
 * Mark message as delivered
 * @param {string} messageId - The message ID
 */
export async function markMessageDeliveredAPI(messageId) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/chat/messages/delivered", { 
      messageId 
    });
  });
}






