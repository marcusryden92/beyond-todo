const pool = require("./db");
const {
  findUserByUsernameSQL,
  addUserSQL,
  getTasksSQL,
  createTaskSQL,
  deleteTaskSQL,
  editTaskSQL,
} = require("./SQL");
// *************************-TASKS-**************************

// Get all the tasks for a user
async function getTasks(user_id) {
  try {
    const result = await pool.query(getTasksSQL, [user_id]);
    return result.rows;
  } catch (error) {
    console.error("Error executing query in getTask:", error);
    throw error;
  }
}

async function createTask(user_id, task) {
  try {
    const result = await pool.query(createTaskSQL, [user_id, task]);
    return result;
  } catch (error) {
    console.error("Error executing query in createTask:", error);
    throw error;
  }
}

async function editTask(task, task_id) {
  try {
    const result = await pool.query(editTaskSQL, [task, task_id]);
    return result;
  } catch (error) {
    console.error("Error executing query in editTask:", error);
    throw error;
  }
}

async function deleteTask(task_id) {
  try {
    const result = await pool.query(
      deleteTaskSQL, // Use binary string B'1' to represent true for BIT column
      [task_id]
    );
    return result;
  } catch (error) {
    console.error("Error executing query in deleteTask:", error.message); // Log specific error message
    throw error;
  }
}

// *************************-USERS-**************************

// Returns an object of the user row
async function findUserByUsername(username) {
  try {
    const result = await pool.query(findUserByUsernameSQL, [username]);
    return result.rows[0]; // Assuming there's only one user with the provided username
  } catch (error) {
    console.error("Error executing query in findUseByUsername:", error);
    throw error;
  }
}

// Creates a new user
async function addUser(user) {
  try {
    const { user_id, username, hashedPassword } = user;
    const result = await pool.query(addUserSQL, [
      user_id,
      username,
      hashedPassword,
    ]);
    return user;
  } catch (error) {
    console.error("Error executing query in addUser", error);
    throw error;
  }
}

module.exports = {
  // createTask,
  findUserByUsername,
  addUser,
  getTasks,
  createTask,
  deleteTask,
  editTask,
};
