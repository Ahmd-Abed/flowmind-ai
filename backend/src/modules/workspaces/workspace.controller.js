const workspaceService = require("./workspace.service");

const asyncHandler = require("../../utils/asyncHandler");

const createWorkspace = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.createWorkspace(
    req.body,
    req.userId,
  );

  res.status(201).json({
    message: "Workspace created successfully",

    workspace,
  });
});

module.exports = {
  createWorkspace,
};
