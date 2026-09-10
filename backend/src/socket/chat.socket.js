const messageService = require("../modules/chat/message.service");
const Workspace = require("../modules/workspaces/workspace.model");

const workspacePresence = new Map();

const getRoomName = (workspaceId) => `workspace_${workspaceId}`;

const getWorkspaceUsers = (workspaceId) =>
  Array.from(workspacePresence.get(workspaceId)?.values() || []).map(
    (presence) => ({
      id: presence.user.id,
      name: presence.user.name,
      email: presence.user.email,
      avatar: presence.user.avatar,
      socketCount: presence.socketIds.size,
    }),
  );

const emitPresence = (io, workspaceId) => {
  io.to(getRoomName(workspaceId)).emit("workspace_presence", {
    workspaceId,
    users: getWorkspaceUsers(workspaceId),
  });
};

const addPresence = (io, socket, workspaceId) => {
  if (!workspacePresence.has(workspaceId)) {
    workspacePresence.set(workspaceId, new Map());
  }

  const users = workspacePresence.get(workspaceId);
  const existing = users.get(socket.userId);

  if (existing) {
    existing.socketIds.add(socket.id);
  } else {
    users.set(socket.userId, {
      user: socket.user,
      socketIds: new Set([socket.id]),
    });
  }

  socket.data.workspaces.add(workspaceId);
  emitPresence(io, workspaceId);
};

const removePresence = (io, socket, workspaceId) => {
  const users = workspacePresence.get(workspaceId);

  if (!users) {
    return;
  }

  const existing = users.get(socket.userId);

  if (existing) {
    existing.socketIds.delete(socket.id);

    if (!existing.socketIds.size) {
      users.delete(socket.userId);
    }
  }

  if (!users.size) {
    workspacePresence.delete(workspaceId);
  }

  socket.data.workspaces.delete(workspaceId);
  emitPresence(io, workspaceId);
};

const canAccessWorkspace = async (workspaceId, userId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    $or: [{ owner: userId }, { "members.user": userId }],
  }).select("_id");

  return Boolean(workspace);
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.data.workspaces = new Set();

    console.log("User connected:", socket.userId);

    socket.on("join_workspace", async (workspaceId, callback) => {
      try {
        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }

        if (!(await canAccessWorkspace(workspaceId, socket.userId))) {
          throw new Error("Access denied");
        }

        socket.join(getRoomName(workspaceId));
        addPresence(io, socket, workspaceId);

        console.log(`User ${socket.userId} joined workspace ${workspaceId}`);

        if (typeof callback === "function") {
          callback({
            ok: true,
            workspaceId,
            users: getWorkspaceUsers(workspaceId),
          });
        }
      } catch (error) {
        if (typeof callback === "function") {
          return callback({ ok: false, message: error.message });
        }

        socket.emit("error_message", error.message);
      }
    });

    socket.on("leave_workspace", (workspaceId, callback) => {
      if (!workspaceId) {
        if (typeof callback === "function") {
          callback({ ok: false, message: "workspaceId is required" });
        }

        return;
      }

      socket.leave(getRoomName(workspaceId));
      removePresence(io, socket, workspaceId);
      socket.to(getRoomName(workspaceId)).emit("user_typing", {
        workspaceId,
        user: socket.user,
        isTyping: false,
      });

      if (typeof callback === "function") {
        callback({ ok: true, workspaceId });
      }
    });

    socket.on("typing_start", async (data = {}) => {
      const { workspaceId } = data;

      if (!workspaceId || !socket.data.workspaces.has(workspaceId)) {
        return;
      }

      socket.to(getRoomName(workspaceId)).emit("user_typing", {
        workspaceId,
        user: socket.user,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data = {}) => {
      const { workspaceId } = data;

      if (!workspaceId || !socket.data.workspaces.has(workspaceId)) {
        return;
      }

      socket.to(getRoomName(workspaceId)).emit("user_typing", {
        workspaceId,
        user: socket.user,
        isTyping: false,
      });
    });

    socket.on("send_message", async (data, callback) => {
      try {
        const { workspaceId, content } = data;

        if (!workspaceId || !content) {
          throw new Error("workspaceId and content are required");
        }

        const message = await messageService.createMessage(
          workspaceId,

          socket.userId,

          content,
        );

        socket.to(getRoomName(workspaceId)).emit("user_typing", {
          workspaceId,
          user: socket.user,
          isTyping: false,
        });

        io.to(getRoomName(workspaceId)).emit("receive_message", message);

        if (typeof callback === "function") {
          callback({ ok: true, message });
        }
      } catch (error) {
        socket.emit("error_message", error.message);

        if (typeof callback === "function") {
          callback({ ok: false, message: error.message });
        }
      }
    });

    socket.on("disconnect", () => {
      for (const workspaceId of Array.from(socket.data.workspaces)) {
        socket.to(getRoomName(workspaceId)).emit("user_typing", {
          workspaceId,
          user: socket.user,
          isTyping: false,
        });
        removePresence(io, socket, workspaceId);
      }

      console.log("User disconnected", socket.userId);
    });
  });
};
