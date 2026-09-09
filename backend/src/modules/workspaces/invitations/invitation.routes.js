const express = require("express");

const router = express.Router();

const controller = require("./invitation.controller");

const { protect } = require("../../middleware/auth.middleware");

const checkWorkspaceRole = require("../../middleware/workspaceRole.middleware");

// Create invitation

router.post(
  "/workspaces/:workspaceId/invitations",

  protect,

  checkWorkspaceRole("owner", "admin"),

  controller.createInvitation,
);

// Accept invitation

router.post(
  "/invitations/:token/accept",

  protect,

  controller.acceptInvitation,
);

module.exports = router;
