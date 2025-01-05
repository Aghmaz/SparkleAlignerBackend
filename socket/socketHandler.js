const socketIO = require("socket.io");

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);
    connectedUsers.set(userId, socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
      connectedUsers.delete(userId);
    });

    // Handle chat messages
    socket.on("sendMessage", async (messageData) => {
      const receiverSocketId = connectedUsers.get(messageData.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", messageData);
      }
    });

    // Handle typing events
    socket.on("typing", ({ receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", { userId });
      }
    });

    socket.on("stopTyping", ({ receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStopTyping", { userId });
      }
    });
  });

  return io;
};

module.exports = setupSocket;
