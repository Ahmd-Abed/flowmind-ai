const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/auth.routes");
const { protect } = require("./middleware/auth.middleware");
const errorHandler = require("./middleware/error.middleware");
const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
const workspaceRoutes = require("./modules/workspaces/workspace.routes");
app.use("/api/workspaces", workspaceRoutes);
const taskRoutes = require("./modules/tasks/task.routes");
app.use("/api/workspaces/:workspaceId/tasks", taskRoutes);
app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route",

    userId: req.userId,
  });
});
const invitationRoutes = require("./modules/workspaces/invitations/invitation.routes");

app.use("/api", invitationRoutes);

const messageRoutes = require("./modules/chat/message.routes");

app.use("/api/workspaces", messageRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "FlowMind API Running",
  });
});

app.use(errorHandler);

module.exports = app;
