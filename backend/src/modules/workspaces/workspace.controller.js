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
const getMyWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await workspaceService.getUserWorkspaces(req.userId);

  res.json({
    count: workspaces.length,

    workspaces,
  });
});

const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.updateWorkspace(
    req.params.workspaceId,

    req.body,
  );

  res.json({
    message: "Workspace updated",

    workspace,
  });
});

const deleteWorkspace = asyncHandler(async (req, res) => {
  await workspaceService.deleteWorkspace(req.params.workspaceId);

  res.json({
    message: "Workspace deleted",
  });
});
const addMember = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.addMemberToWorkspace(
    req.params.workspaceId,

    req.body.userId,
  );

  res.status(200).json({
    message: "User added to workspace",

    workspace,
  });
});
const updateMemberRole = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.updateMemberRole(
    req.params.workspaceId,

    req.params.userId,

    req.body.role,
  );

  res.status(200).json({
    message: "Member role updated successfully",

    workspace,
  });
});
module.exports = {
  createWorkspace,
  getMyWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  updateMemberRole,
};
