// Database bootstrap: creates the `users` and `tasks` tables.
// Safe to run repeatedly — every statement is idempotent (CREATE TABLE IF NOT EXISTS).
//
// Usage (from the /server directory):
//   npm run initdb
//
// Reads DATABASE_URL from the environment (see .env.example). Works against a
// managed provider like Neon (the database already exists for you) or a local
// Postgres instance (create the database first, e.g. `createdb group5`).

const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// --- Schema (reconstructed from the SQL in ../queries) ---
// users.user_id is a UUID the app generates with uuidv4(); password is a bcrypt hash.
const createUsersTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    user_id  UUID          PRIMARY KEY,
    username VARCHAR(255)  NOT NULL UNIQUE,
    password VARCHAR(255)  NOT NULL
  );
`;

// task_completed is BIT(1) because the task queries write B'1' and compare '0'.
// The foreign key ON DELETE CASCADE is what makes "delete account" sweep the tasks.
const createTasksTableSQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    task_id        SERIAL  PRIMARY KEY,
    user_id        UUID    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    task           TEXT    NOT NULL,
    task_completed BIT(1)  NOT NULL DEFAULT B'0'
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
`;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
  );
  process.exit(1);
}

// Managed providers (Neon, etc.) require SSL; a local server usually doesn't.
const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);

async function initDb() {
  const client = new Client({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    // users first — tasks references it.
    await client.query(createUsersTableSQL);
    await client.query(createTasksTableSQL);
    console.log("Tables are ready: users, tasks.");
    console.log("Database initialization complete.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

initDb();
