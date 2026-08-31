const bcrypt = require("bcrypt");
const User = require("../users/user.model");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");
const registerUser = async (data) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,

    email: data.email,

    password: hashedPassword,
  });

  return user;
};

const loginUser = async (data) => {
  const user = await User.findOne({
    email: data.email,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);

  const refreshToken = generateRefreshToken(user._id);

  return {
    user,

    accessToken,

    refreshToken,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
