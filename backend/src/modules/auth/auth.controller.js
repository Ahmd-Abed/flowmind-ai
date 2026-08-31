// const authService = require("./auth.service");

// const register = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;
//     const result = await authService.register({ name, email, password });

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: result,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const result = await authService.login({ email, password });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: result,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// const me = async (req, res) => {
//   return res.status(200).json({
//     success: true,
//     data: req.user,
//   });
// };

// module.exports = {
//   register,
//   login,
//   me,
// };
