const { test } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const jwt = require("jsonwebtoken");
const Workspace = require("../src/modules/workspaces/workspace.model");
const Task = require("../src/modules/tasks/task.model");
const routes = require("../src/modules/tasks/task.routes");
const errorHandler = require("../src/middleware/error.middleware");

test("task API validation and workspace isolation", async (t) => {
  const owner = "111111111111111111111111";
  const member = "222222222222222222222222";
  const workspaceId = "333333333333333333333333";
  const taskId = "444444444444444444444444";
  const outsider = "555555555555555555555555";
  const admin = "666666666666666666666666";
  process.env.JWT_ACCESS_SECRET = "task-test-secret";
  t.mock.method(Workspace, "findById", async () => ({
    _id: workspaceId, owner, members: [{ user: owner, role: "owner" }, { user: member, role: "member" }, { user: admin, role: "admin" }],
  }));
  const create = t.mock.method(Task, "create", async data => ({ _id: taskId, ...data }));
  const find = t.mock.method(Task, "findOne", async () => null);
  const remove = t.mock.method(Task, "findOneAndDelete", async () => ({ _id: taskId }));
  const update = t.mock.method(Task, "findOneAndUpdate", async () => null);
  const app = express();
  app.use(express.json());
  app.use("/api/workspaces/:workspaceId/tasks", routes);
  app.use(errorHandler);
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  t.after(() => new Promise(resolve => {
    server.close(resolve);
    server.closeAllConnections();
  }));
  const url = `http://127.0.0.1:${server.address().port}/api/workspaces/${workspaceId}/tasks`;
  const request = (path = "", method = "GET", body, user = member) => fetch(url + path, {
    method,
    headers: { "Content-Type": "application/json", ...(user ? { Authorization: `Bearer ${jwt.sign({ id: user }, process.env.JWT_ACCESS_SECRET)}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  assert.equal((await request("", "GET", undefined, null)).status, 401);
  assert.equal((await request("", "POST", { title: "Task" }, outsider)).status, 403);
  for (const body of [{ title: " " }, { title: "Task", workspace: workspaceId }, { title: "Task", status: "bad" }, { title: "Task", assignedUsers: [member, member] }]) {
    assert.equal((await request("", "POST", body)).status, 400);
  }
  assert.equal((await request("", "POST", { title: "Task", assignedUsers: [outsider] })).status, 400);
  assert.equal(create.mock.callCount(), 0);
  const response = await request("", "POST", { title: "  Task  ", assignedUsers: [member] });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).task.title, "Task");
  assert.equal(create.mock.calls[0].arguments[0].workspace, workspaceId);
  assert.equal((await request("/invalid")).status, 400);
  assert.equal((await request(`/${taskId}`)).status, 404);
  assert.deepEqual(find.mock.calls[0].arguments[0], { _id: taskId, workspace: workspaceId, assignedUsers: member });
  assert.equal((await request(`/${taskId}`, "PATCH", {})).status, 400);
  assert.equal((await request(`/${taskId}`, "PATCH", { status: "done" })).status, 404);
  assert.deepEqual(update.mock.calls[0].arguments[0], { _id: taskId, workspace: workspaceId, assignedUsers: member });
  assert.equal((await request(`/${taskId}`, "DELETE")).status, 403);
  assert.equal(remove.mock.callCount(), 0);
  assert.equal((await request(`/${taskId}`, "DELETE", undefined, owner)).status, 204);
  assert.deepEqual(remove.mock.calls[0].arguments[0], { _id: taskId, workspace: workspaceId });
  assert.equal((await request("?limit=101")).status, 400);

  const list = t.mock.method(Task, "find", () => ({
    sort() { return this; }, skip() { return this; }, limit() { return Promise.resolve([]); },
  }));
  const count = t.mock.method(Task, "countDocuments", async () => 0);
  for (const user of [member, owner, admin]) {
    assert.equal((await request("", "GET", undefined, user)).status, 200);
    const expected = { workspace: workspaceId, ...(user === member ? { assignedUsers: member } : {}) };
    assert.deepEqual(list.mock.calls.at(-1).arguments[0], expected);
    assert.deepEqual(count.mock.calls.at(-1).arguments[0], expected);
    assert.equal((await request(`/${taskId}`, "GET", undefined, user)).status, 404);
    assert.deepEqual(find.mock.calls.at(-1).arguments[0], { _id: taskId, ...expected });
    assert.equal((await request(`?assignedUser=${owner}`, "GET", undefined, user)).status, 200);
    assert.deepEqual(list.mock.calls.at(-1).arguments[0], { workspace: workspaceId, assignedUsers: user === member ? member : owner });
    assert.deepEqual(count.mock.calls.at(-1).arguments[0], list.mock.calls.at(-1).arguments[0]);
  }
  find.mock.mockImplementation(async filter => filter.assignedUsers === member ? { _id: taskId, assignedUsers: [member] } : null);
  assert.equal((await request(`/${taskId}`)).status, 200);
});
