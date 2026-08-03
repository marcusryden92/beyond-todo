const Pool = require("pg").Pool;
const dotenv = require("dotenv");

dotenv.config();

// A single connection string works for both Neon (managed) and local Postgres.
// Managed providers require SSL; a local server usually doesn't offer it.
const connectionString = process.env.DATABASE_URL;
const isLocal =
  !connectionString || /localhost|127\.0\.0\.1/.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  // Neon suspends its compute when idle and drops the connection. Give a new
  // connection several seconds to wake it before giving up (instead of hanging).
  connectionTimeoutMillis: 10000,
});

// CRITICAL for a serverless database like Neon: when the compute suspends it
// terminates idle pooled connections, which node-postgres surfaces as an 'error'
// event on the pool. With no listener, Node throws an uncaught exception and the
// whole server crashes — which on Render just triggers another cold start.
// Handling it lets the pool quietly discard the dead client; the next query
// opens a fresh connection and wakes Neon back up.
pool.on("error", (err) => {
  console.error("Unexpected idle Postgres client error:", err.message);
});

module.exports = pool;
