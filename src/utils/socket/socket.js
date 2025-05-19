import { io } from "socket.io-client";
const ws = false;
const socket = io(
  ws === true ? "https://tech.gai2.shop" : "https://qmenubackender.onrender.com"
);

// Check socket connection
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
});

export default socket;
