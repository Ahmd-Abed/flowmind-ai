const Workspace = require("./workspace.model");
const User = require("../users/user.model");
const createWorkspace = async (data, userId) => {
  const workspace = await Workspace.create({
    name: data.name,

    owner: userId,

    members: [
      {
        user: userId,
        role: "owner",
      },
    ],
  });

  return workspace;
};

const getUserWorkspaces = async (userId) => {
  const workspaces = await Workspace.find({
    $or: [
      {
        owner: userId,
      },
      {
        "members.user": userId,
      },
    ],
  })
    .populate("owner", "name email")
    .populate("members.user", "name email");

  return workspaces;
};

const updateWorkspace = async (workspaceId, data) => {
  const workspace = await Workspace.findByIdAndUpdate(
    workspaceId,

    {
      name: data.name,
    },

    {
      new: true,
    },
  );

  return workspace;
};

const deleteWorkspace = async (workspaceId) => {
  await Workspace.findByIdAndDelete(workspaceId);
};

const addMemberToWorkspace = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const alreadyMember = workspace.members.some(
    (member) => member.user.toString() === userId,
  );

  if (alreadyMember) {
    throw new Error("User already in workspace");
  }

  workspace.members.push({
    user: userId,

    role: "member",
  });

  await workspace.save();

  return workspace;
};
const updateMemberRole = async (workspaceId, userId, role) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const member = workspace.members.find(
    (member) => member.user.toString() === userId,
  );

  if (!member) {
    throw new Error("User is not a member");
  }

  member.role = role;

  await workspace.save();

  return workspace;
};
module.exports = {
  createWorkspace,
  getUserWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  addMemberToWorkspace,
  updateMemberRole,
};
