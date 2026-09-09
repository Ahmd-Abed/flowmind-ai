const service = require("./task.service");
const asyncHandler = require("../../utils/asyncHandler");

exports.createTask = asyncHandler(async (req, res) => {
  const task = await service.createTask(req.workspace, req.userId, req.taskData);
  res.status(201).json({ message: "Task created successfully", task });
});
exports.listTasks = asyncHandler(async (req, res) => {
  res.json(await service.listTasks(req.taskParams.workspaceId, req.taskQuery, req.userId, req.workspaceRole));
});
exports.getTask = asyncHandler(async (req, res) => {
  res.json({ task: await service.getTask(req.taskParams.workspaceId, req.taskParams.taskId, req.userId, req.workspaceRole) });
});
exports.updateTask = asyncHandler(async (req, res) => {
  const task = await service.updateTask(req.workspace, req.taskParams.taskId, req.taskData, req.userId, req.workspaceRole);
  res.json({ message: "Task updated successfully", task });
});
exports.deleteTask = asyncHandler(async (req, res) => {
  await service.deleteTask(req.taskParams.workspaceId, req.taskParams.taskId);
  res.status(204).send();
});
