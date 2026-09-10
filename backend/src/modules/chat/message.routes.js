const express = require("express");

const router = express.Router();

const controller = require("./message.controller");

const { protect } = require("../../middleware/auth.middleware");

router.post("/:workspaceId/messages", protect, controller.sendMessage);

router.get("/:workspaceId/messages", protect, controller.getHistory);

module.exports = router;
