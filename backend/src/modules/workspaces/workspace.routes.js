const express = require("express");

const router = express.Router();

const controller = require("./workspace.controller");

const { protect } = require("../../middleware/auth.middleware");

router.post("/", protect, controller.createWorkspace);

module.exports = router;
