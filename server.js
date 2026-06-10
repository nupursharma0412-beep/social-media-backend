require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const http = require("http");
const { Server } = require("socket.io"); 

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://social-media-frontend-gules-five.vercel.app",
    credentials: true,
  },
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => { 
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
