const asyncHandler = require("../../utils/asyncHandler");

const messageService = require("./message.service");

const sendMessage = asyncHandler(async (req, res) => {
  const message = await messageService.createMessage(
    req.params.workspaceId,

    req.userId,

    req.body.content,
  );

  res.status(201).json({
    message: "Message sent",

    data: message,
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const messages = await messageService.getMessages(
    req.params.workspaceId,

    req.userId,
  );

  res.json({
    count: messages.length,

    messages,
  });
});

module.exports = {
  sendMessage,
  getHistory,
};
