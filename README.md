# flowmind-ai
Build a production-grade platform that combines advanced Node.js backend engineering, MongoDB Atlas cloud database, modern authentication, middleware architecture, real-time communication, AI capabilities, and cloud deployment.

## Tasks API

All task endpoints require `Authorization: Bearer <access-token>` and workspace membership.
Owners and admins can read and update all tasks in their workspace. Regular members can only list, retrieve, and update tasks assigned to them. All workspace members can create tasks. Only owners and admins can delete tasks. Requests to retrieve or update an inaccessible task return 404.

| Method | Endpoint | Result |
| --- | --- | --- |
| POST | `/api/workspaces/:workspaceId/tasks` | Create a task (201) |
| GET | `/api/workspaces/:workspaceId/tasks` | List workspace tasks |
| GET | `/api/workspaces/:workspaceId/tasks/:taskId` | Retrieve a task |
| PATCH | `/api/workspaces/:workspaceId/tasks/:taskId` | Update provided fields |
| DELETE | `/api/workspaces/:workspaceId/tasks/:taskId` | Delete a task (204) |

Create example:

```json
{
  "title": "Build dashboard",
  "description": "Show workspace activity",
  "status": "todo",
  "priority": "high",
  "assignedUsers": []
}
```

Only `title` is required on creation. Status accepts `todo`, `in_progress`, or `done` (default `todo`). Priority accepts `low`, `medium`, or `high` (default `medium`). Assignees must belong to the workspace; send an empty array to clear assignments. Workspace and creator are server-managed.

List query parameters: `status`, `priority`, `assignedUser`, `page` (default 1), and `limit` (default 20, maximum 100). Owners/admins can filter by `assignedUser`; regular members always receive only their own assigned tasks, regardless of this parameter. Results contain `tasks`, `count`, `total`, `page`, and `limit`, sorted newest first. Counts include only tasks visible to the caller.

Run backend tests with `cd backend` then `npm test`. Task API tests use mocked database operations and do not require MongoDB or Redis.
