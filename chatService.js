const BASE_URL = "http://localhost:5000";

const chatService = {
  getConversations: async (token) => {
    const response = await fetch(`${BASE_URL}/conversation`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  sendMessage: async (token, messageData) => {
    const response = await fetch(`${BASE_URL}/message/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });
    return response.json();
  },

  getMessages: async (token, conversationId) => {
    const response = await fetch(`${BASE_URL}/message/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

export default chatService;
