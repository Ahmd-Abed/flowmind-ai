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

app.use(errorHandler);
app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route",

    userId: req.userId,
  });
});
app.get("/", (req, res) => {
  res.json({
    message: "FlowMind API Running",
  });
});

module.exports = app;
