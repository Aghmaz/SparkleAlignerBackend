import { useEffect, useState } from "react";
import io from "socket.io-client";
import chatService from "./chatService";

const ChatComponent = ({ token, userId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Setup user in socket
    newSocket.emit("setup", userId);

    // Socket event listeners
    newSocket.on("receive-message", handleNewMessage);
    newSocket.on("typing", handleTyping);
    newSocket.on("stop-typing", handleStopTyping);
    newSocket.on("user-online", handleUserOnline);
    newSocket.on("user-offline", handleUserOffline);

    return () => newSocket.close();
  }, []);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation._id);
    }
  }, [currentConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await chatService.getConversations(token);
      setConversations(data);
    } catch (error) {
      setError("Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const data = await chatService.getMessages(token, conversationId);
      setMessages(data);
    } catch (error) {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!currentConversation) return;

    try {
      const messageData = {
        conversationId: currentConversation._id,
        sender: userId,
        text,
      };

      const data = await chatService.sendMessage(token, messageData);
      socket.emit("send-message", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      setError("Failed to send message");
    }
  };

  const handleNewMessage = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleTyping = ({ userId, conversationId }) => {
    // Update UI to show typing indicator
  };

  const handleStopTyping = ({ userId, conversationId }) => {
    // Remove typing indicator
  };

  const handleUserOnline = (userId) => {
    // Update UI to show user is online
  };

  const handleUserOffline = (userId) => {
    // Update UI to show user is offline
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chat-container">
      {/* Conversation List */}
      <div className="conversation-list">
        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => setCurrentConversation(conv)}
            className={`conversation ${
              currentConversation?._id === conv._id ? "active" : ""
            }`}
          >
            {/* Conversation item UI */}
          </div>
        ))}
      </div>

      {/* Chat Messages */}
      {currentConversation ? (
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`message ${
                message.sender === userId ? "sent" : "received"
              }`}
            >
              {message.text}
            </div>
          ))}

          {/* Message Input */}
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div>Select a conversation to start chatting</div>
      )}
    </div>
  );
};

export default ChatComponent;
