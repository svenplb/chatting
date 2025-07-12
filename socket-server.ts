import { Server } from "socket.io";
import http from "http";

const PORT = 4000;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev; restrict in prod
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for new chat messages
  socket.on("chat-message", (msg) => {
    // Broadcast the message to all clients (including sender)
    io.emit("chat-message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}/`);
}); 