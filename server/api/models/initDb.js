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

const { createUsersTableSQL } = require("./userModel");
const { createTasksTableSQL } = require("./taskModel");

dotenv.config();

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
