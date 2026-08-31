// const { verifyToken } = require("../utils/jwt");

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || "";

//     if (!authHeader.startsWith("Bearer ")) {
//       const error = new Error("Authorization token is missing or invalid");
//       error.statusCode = 401;
//       throw error;
//     }

//     const token = authHeader.replace("Bearer ", "").trim();
//     const payload = verifyToken(token);

//     req.user = {
//       id: payload.sub,
//       email: payload.email,
//     };

//     return next();
//   } catch (error) {
//     error.statusCode = error.statusCode || 401;
//     return next(error);
//   }
// };

// module.exports = {
//   authMiddleware,
// };
