// mockServer.js
import { WebSocketServer } from "ws";

// Create WebSocket server on port 3001
const wss = new WebSocketServer({ port: 4000, path: "/mock" });

console.log("🚀 Mock WebSocket server running on ws://localhost:4000/mock");

// List of active clients
const clients = new Set();

// Helper to broadcast a message to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}

// Mock users
const mockUsers = [
  "alice",
  "bob",
  "charlie",
  "dave",
  "eve",
  "frank",
  "grace",
  "heidi",
  "ivan",
  "judy",
];

// Handle client connections
wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("👤 New WebSocket client connected");

  ws.on("close", () => {
    clients.delete(ws);
    console.log("❌ Client disconnected");
  });

  ws.on("message", (msg) => {
    console.log("📩 Received from client:", msg.toString());
  });
});

// Every 4 seconds, emit a random LOGIN/LOGOUT event
setInterval(() => {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const isLogin = Math.random() > 0.5;

  const event = {
    type: isLogin ? "LOGIN" : "LOGOUT",
    user,
    timestamp: Date.now(),
  };

  console.log("📢 Sending event:", event);
  broadcast(event);
}, 4000);
