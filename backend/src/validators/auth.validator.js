const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),

  email: z.string().email("Invalid email format"),

  password: z.string().min(6, "Password must contain at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),

  password: z.string().min(6, "Password must contain at least 6 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
