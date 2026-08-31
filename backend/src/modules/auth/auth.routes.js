const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");
const validate = require("../../middleware/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../../validators/auth.validator");
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
module.exports = router;
