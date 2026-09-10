const Message = require("./message.model");
const Workspace = require("../workspaces/workspace.model");

const createMessage = async (workspaceId, userId, content) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isMember = workspace.members.some(
    (member) => member.user.toString() === userId,
  );

  if (!isMember) {
    throw new Error("You are not a workspace member");
  }

  const message = await Message.create({
    workspace: workspaceId,

    sender: userId,

    content,
  });

  return message.populate("sender", "name email avatar");
};

const getMessages = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isMember = workspace.members.some(
    (member) => member.user.toString() === userId,
  );

  if (!isMember) {
    throw new Error("Access denied");
  }

  return Message.find({
    workspace: workspaceId,
  })
    .populate("sender", "name email avatar")
    .sort({
      createdAt: 1,
    });
};

module.exports = {
  createMessage,
  getMessages,
};
