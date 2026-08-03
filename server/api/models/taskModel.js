// Task model — definition for the `tasks` table.
//
// Columns (reconstructed from the queries in ../SQL.js):
//   task_id        SERIAL  primary key, auto-incremented by Postgres
//   user_id        UUID    owner, foreign key -> users(user_id)
//   task           TEXT    the task description
//   task_completed BIT(1)  completion / soft-delete flag (B'0' = active, B'1' = done)
//
// task_completed is a BIT column because SQL.js writes B'1' and compares against
// '0'. A BOOLEAN would be more idiomatic, but that would mean changing those
// queries too, so the type is kept faithful to the original code.
//
// The foreign key (ON DELETE CASCADE) and the user_id index are additions that
// were not in the original database — they enforce integrity and speed up the
// per-user lookup in getTasksSQL. Remove them if you want a 1:1 reconstruction.

const createTasksTableSQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    task_id        SERIAL  PRIMARY KEY,
    user_id        UUID    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    task           TEXT    NOT NULL,
    task_completed BIT(1)  NOT NULL DEFAULT B'0'
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
`;

module.exports = { createTasksTableSQL };
