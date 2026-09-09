const Task = require("./task.model");
const AppError = require("../../utils/AppError");

const validateAssignees = (workspace, assignedUsers = []) => {
  const members = new Set([String(workspace.owner), ...workspace.members.map(member => String(member.user))]);
  if (assignedUsers.some(id => !members.has(String(id)))) {
    throw new AppError("Assigned users must belong to this workspace", 400);
  }
};

const createTask = async (workspace, userId, data) => {
  validateAssignees(workspace, data.assignedUsers);
  return Task.create({ ...data, workspace: workspace._id, createdBy: userId });
};

const accessFilter = (workspaceId, userId, role) => {
  if (!userId) throw new AppError("Authentication required", 401);
  return {
    workspace: workspaceId,
    ...(["owner", "admin"].includes(role) ? {} : { assignedUsers: userId }),
  };
};

const listTasks = async (workspaceId, { status, priority, assignedUser, page, limit }, userId, role) => {
  const filter = accessFilter(workspaceId, userId, role);
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedUser && ["owner", "admin"].includes(role)) filter.assignedUsers = assignedUser;
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
    Task.countDocuments(filter),
  ]);
  return { tasks, count: tasks.length, total, page, limit };
};

const getTask = async (workspaceId, taskId, userId, role) => {
  const task = await Task.findOne({ _id: taskId, ...accessFilter(workspaceId, userId, role) });
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

const updateTask = async (workspace, taskId, data, userId, role) => {
  validateAssignees(workspace, data.assignedUsers);
  const task = await Task.findOneAndUpdate(
    { _id: taskId, ...accessFilter(workspace._id, userId, role) },
    { $set: data },
    { new: true, runValidators: true },
  );
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

const deleteTask = async (workspaceId, taskId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, workspace: workspaceId });
  if (!task) throw new AppError("Task not found", 404);
};

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask };
