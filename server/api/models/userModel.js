// User model — definition for the `users` table.
//
// Columns (reconstructed from the queries in ../SQL.js):
//   user_id   UUID          primary key, generated in the app with uuidv4()
//   username  VARCHAR(255)  unique login name
//   password  VARCHAR(255)  bcrypt hash (never the plain-text password)

const createUsersTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    user_id  UUID          PRIMARY KEY,
    username VARCHAR(255)  NOT NULL UNIQUE,
    password VARCHAR(255)  NOT NULL
  );
`;

module.exports = { createUsersTableSQL };
