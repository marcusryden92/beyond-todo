const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: process.env.DBUSERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DBPORT,
  database: "group5",
});

module.exports = pool;

// Create User
const createUser = `
INSERT INTO users (user_id, username, password)
VALUES ($1, $2, $3, $4)
`;

const findUserByUserName = `
SELECT * FROM users WHERE user_id = $()
`;

// Create Task
const createTask = `
INSERT INTO tasks (task_id, user_id, text) 
VALUES ($1, $2, $3)
`;

// Edit Task
const editTask = `
UPDATE task
SET task = ($1)
WHERE task_id = ($1)
`;

// Remove task
const removeTask = `
UPDATE task
SET task_completed = 1
WHERE task_id = ($1)
`;
