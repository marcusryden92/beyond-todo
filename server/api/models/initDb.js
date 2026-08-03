// Database bootstrap: creates the `group5` database (if it is missing) and all
// tables, then exits. Safe to run repeatedly — every statement is idempotent.
//
// Usage (from the /server directory):
//   npm run initdb
//
// Requires the same PostgreSQL env vars as db.js (see .env.example):
//   DBUSERNAME, PASSWORD, HOST, DBPORT

const { Client } = require("pg");
const dotenv = require("dotenv");

const { createUsersTableSQL } = require("./userModel");
const { createTasksTableSQL } = require("./taskModel");

dotenv.config();

// Must match the database name hard-coded in db.js.
const DB_NAME = "group5";

const connection = {
  user: process.env.DBUSERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DBPORT,
};

// Step 1 — make sure the database itself exists.
async function ensureDatabase() {
  // Connect to the default maintenance database so we can create ours.
  const client = new Client({ ...connection, database: "postgres" });
  await client.connect();
  try {
    const { rowCount } = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME],
    );
    if (rowCount === 0) {
      // CREATE DATABASE can't be parameterised; DB_NAME is a fixed constant.
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Created database "${DB_NAME}".`);
    } else {
      console.log(`Database "${DB_NAME}" already exists — skipping create.`);
    }
  } finally {
    await client.end();
  }
}

// Step 2 — create the tables (users first, tasks references it).
async function createTables() {
  const client = new Client({ ...connection, database: DB_NAME });
  await client.connect();
  try {
    await client.query(createUsersTableSQL);
    await client.query(createTasksTableSQL);
    console.log("Tables are ready: users, tasks.");
  } finally {
    await client.end();
  }
}

async function initDb() {
  try {
    await ensureDatabase();
    await createTables();
    console.log("Database initialization complete.");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
}

initDb();
