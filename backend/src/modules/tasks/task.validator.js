const { z } = require("zod");

const id = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID").transform(value => value.toLowerCase());
const fields = {
  title: z.string().trim().min(1).max(200),
  description: z.string().max(10000),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  assignedUsers: z.array(id).max(100).refine(values => new Set(values).size === values.length, "Duplicate assignees"),
};
const create = z.object({
  ...fields,
  description: fields.description.optional(),
  status: fields.status.optional(),
  priority: fields.priority.optional(),
  assignedUsers: fields.assignedUsers.optional(),
}).strict();
const update = z.object(fields).partial().strict().refine(value => Object.keys(value).length > 0, "Provide at least one field");
const params = z.object({ workspaceId: id, taskId: id.optional() });
const query = z.object({
  status: fields.status.optional(),
  priority: fields.priority.optional(),
  assignedUser: id.optional(),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

const validate = (schema, source, target) => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) return res.status(400).json({ message: "Validation failed", errors: result.error.issues });
  req[target] = result.data;
  next();
};
module.exports = { create, update, params, query, validate };
