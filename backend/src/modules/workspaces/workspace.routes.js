const express = require("express");
const checkWorkspaceRole = require("../../middleware/workspaceRole.middleware");
const router = express.Router();

const controller = require("./workspace.controller");

const { protect } = require("../../middleware/auth.middleware");

router.post("/", protect, controller.createWorkspace);
router.get("/", protect, controller.getMyWorkspaces);

router.delete(
  "/:workspaceId",

  protect,

  checkWorkspaceRole("owner", "admin"),

  controller.deleteWorkspace,
);
router.patch(
  "/:workspaceId",

  protect,

  checkWorkspaceRole("owner", "admin"),

  controller.updateWorkspace,
);
router.post(
  "/:workspaceId/members",

  protect,

  checkWorkspaceRole("owner", "admin"),

  controller.addMember,
);
router.patch(
  "/:workspaceId/members/:userId",

  protect,

  checkWorkspaceRole("owner"),

  controller.updateMemberRole,
);
module.exports = router;
