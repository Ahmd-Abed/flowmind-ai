require("dotenv").config();

const { io } = require("socket.io-client");

const [, , token, workspaceId, ...contentParts] = process.argv;
const content = contentParts.join(" ") || `Socket test ${new Date().toISOString()}`;

if (!token || !workspaceId) {
  console.error(
    "Usage: node scripts/test-socket-chat.js <jwt-token> <workspace-id> [message]",
  );
  process.exit(1);
}

const socket = io(process.env.SOCKET_URL || "http://localhost:5000", {
  auth: { token },
  transports: ["websocket"],
});

const timeout = setTimeout(() => {
  console.error("Timed out waiting for socket response");
  socket.disconnect();
  process.exit(1);
}, 10000);

socket.on("connect", () => {
  console.log("connected", socket.id);

  socket.emit("join_workspace", workspaceId, (joinResponse) => {
    console.log("join_workspace ack", joinResponse);

    if (!joinResponse?.ok) {
      clearTimeout(timeout);
      socket.disconnect();
      process.exit(1);
    }

    socket.emit("send_message", { workspaceId, content }, (sendResponse) => {
      console.log("send_message ack", sendResponse);

      if (!sendResponse?.ok) {
        clearTimeout(timeout);
        socket.disconnect();
        process.exit(1);
      }
    });
  });
});

socket.on("receive_message", (message) => {
  console.log("receive_message", message);
  clearTimeout(timeout);
  socket.disconnect();
});

socket.on("connect_error", (error) => {
  console.error("connect_error", error.message);
  clearTimeout(timeout);
  process.exit(1);
});

socket.on("error_message", (message) => {
  console.error("error_message", message);
});
