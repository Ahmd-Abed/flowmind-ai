const Workspace = require("./workspace.model");

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

module.exports = {
  createWorkspace,
};
