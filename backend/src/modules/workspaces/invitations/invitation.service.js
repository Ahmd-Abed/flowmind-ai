const crypto = require("crypto");

const Invitation = require("./invitation.model");
const Workspace = require("./workspace.model");
const User = require("../users/user.model");

const createInvitation = async (workspaceId, data, userId) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const userExists = await User.findOne({
    email: data.email,
  });

  if (!userExists) {
    throw new Error("User with this email does not exist");
  }

  const alreadyMember = workspace.members.some(
    (member) => member.user.toString() === userExists._id.toString(),
  );

  if (alreadyMember) {
    throw new Error("User already member of workspace");
  }

  const existingInvitation = await Invitation.findOne({
    workspace: workspaceId,
    email: data.email,
    status: "pending",
  });

  if (existingInvitation) {
    throw new Error("Invitation already sent");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invitation = await Invitation.create({
    workspace: workspaceId,

    email: data.email,

    role: data.role || "member",

    token,

    invitedBy: userId,

    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await emailQueue.add("sendInvitationEmail", {
    email: data.email,
    token,
  });
  return invitation;
};

const acceptInvitation = async (token, userId) => {
  const invitation = await Invitation.findOne({
    token,
    status: "pending",
  });

  if (!invitation) {
    throw new Error("Invalid invitation");
  }

  if (invitation.expiresAt < new Date()) {
    invitation.status = "expired";

    await invitation.save();

    throw new Error("Invitation expired");
  }

  const workspace = await Workspace.findById(invitation.workspace);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const alreadyMember = workspace.members.some(
    (member) => member.user.toString() === userId,
  );

  if (alreadyMember) {
    throw new Error("Already workspace member");
  }

  workspace.members.push({
    user: userId,

    role: invitation.role,
  });

  await workspace.save();

  invitation.status = "accepted";

  await invitation.save();

  return workspace;
};

module.exports = {
  createInvitation,
  acceptInvitation,
};
