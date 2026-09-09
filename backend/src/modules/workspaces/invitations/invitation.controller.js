const asyncHandler = require("../../../utils/asyncHandler");

const invitationService = require("./invitation.service");

const createInvitation = asyncHandler(async (req, res) => {
  const invitation = await invitationService.createInvitation(
    req.params.workspaceId,

    req.body,

    req.userId,
  );

  res.status(201).json({
    message: "Invitation created successfully",

    invitation,
  });
});

const acceptInvitation = asyncHandler(async (req, res) => {
  const workspace = await invitationService.acceptInvitation(
    req.params.token,

    req.userId,
  );

  res.status(200).json({
    message: "Invitation accepted",

    workspace,
  });
});

module.exports = {
  createInvitation,
  acceptInvitation,
};
