const pool = require("./db");

// *************************-TASKS-**************************

// Reads the whole table
function readTasks() {
  return async (_, res) => {
    try {
      const tasks = await pool.query("SELECT * FROM tasks");
      res.json(tasks.rows);
    } catch (error) {
      console.error(error);
    }
  };
}

// Creates a new task
function createTask(task_id, user_id, text) {
  return async (req, res) => {
    const result = await pool.query(
      `INSERT INTO tasks (task_id, user_id, text) VALUES (?, ?, ?)`,
      [task_id, user_id, text]
    );
    return result;
  };
}

async function getTasks(user_id) {
  try {
    const result = await pool.query(
      `
    SELECT *
    FROM tasks
    INNER JOIN users ON tasks.user_id = users.user_id
    WHERE users.user_id = $1;
    `,
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error executing query in getTask:", error);
    throw error;
  }
}

// `
// SELECT task.*
// FROM tasks
// INNER JOIN users ON tasks.user_id = users.user_id
// WHERE users.user_id = $1;
// `

// *************************-USERS-**************************

// Returns an object of the user row
async function findUserByUsername(username) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0]; // Assuming there's only one user with the provided username
  } catch (error) {
    console.error("Error executing query in findUseByUsername:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Creates a new user
async function addUser(user) {
  try {
    const { user_id, username, hashedPassword } = user;
    const result = await pool.query(
      `INSERT INTO users (user_id, username, password) 
          VALUES ($1, $2, $3)`,
      [user_id, username, hashedPassword]
    );
    return user;
  } catch (error) {
    console.error("Error executing query in addUser", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// app.post("/todos", async(req, res), () => {
//   const { task_id, user_id, text } = req.body;
//   createTask(task_id, user_id, text);
// });

module.exports = {
  readTasks,
  createTask,
  findUserByUsername,
  addUser,
  getTasks,
};
