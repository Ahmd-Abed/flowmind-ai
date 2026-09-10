const router = require("express").Router({ mergeParams: true });
const { protect } = require("../../middleware/auth.middleware");
const checkWorkspaceRole = require("../../middleware/workspaceRole.middleware");
const controller = require("./task.controller");
const v = require("./task.validator");

router.use(protect);
router.use(v.validate(v.params, "params", "taskParams"));
router.use(checkWorkspaceRole("owner", "admin", "member"));
router.post("/", v.validate(v.create, "body", "taskData"), controller.createTask);
router.get("/", v.validate(v.query, "query", "taskQuery"), controller.listTasks);
router.get("/:taskId", v.validate(v.params, "params", "taskParams"), controller.getTask);
router.patch("/:taskId", v.validate(v.params, "params", "taskParams"), v.validate(v.update, "body", "taskData"), controller.updateTask);
router.delete("/:taskId", v.validate(v.params, "params", "taskParams"), checkWorkspaceRole("owner", "admin"), controller.deleteTask);

module.exports = router;
