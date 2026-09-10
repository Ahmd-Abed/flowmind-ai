const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const registerChatSocket = require("./chat.socket");
const User = require("../modules/users/user.model");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select("name email avatar");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  registerChatSocket(io);
};

module.exports = {
  initSocket,
};
