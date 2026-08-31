const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    message: "User created successfully",

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,

    secure: false,

    sameSite: "strict",

    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login successful",

    accessToken: result.accessToken,

    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
    },
  });
});
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out",
  });
});
module.exports = {
  register,
  login,
  logout,
};
