const authService = require("./auth.service");

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      message: "User created successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};
const logout = (req, res) => {
  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out",
  });
};
module.exports = {
  register,
  login,
  logout,
};
