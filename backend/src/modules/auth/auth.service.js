// const bcrypt = require("bcrypt");
// const User = require("../users/user.model");
// const { signToken } = require("../../utils/jwt");

// const sanitizeUser = (userDoc) => ({
//   id: userDoc._id,
//   name: userDoc.name,
//   email: userDoc.email,
// });

// const register = async ({ name, email, password }) => {
//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     const error = new Error("Email already in use");
//     error.statusCode = 409;
//     throw error;
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//   });

//   const token = signToken({ sub: user._id.toString(), email: user.email });

//   return {
//     user: sanitizeUser(user),
//     token,
//   };
// };

// const login = async ({ email, password }) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     const error = new Error("Invalid email or password");
//     error.statusCode = 401;
//     throw error;
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     const error = new Error("Invalid email or password");
//     error.statusCode = 401;
//     throw error;
//   }

//   const token = signToken({ sub: user._id.toString(), email: user.email });

//   return {
//     user: sanitizeUser(user),
//     token,
//   };
// };

// module.exports = {
//   register,
//   login,
// };
