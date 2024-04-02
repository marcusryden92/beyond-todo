const pool = require("../db");

const {
  getTasksSQL,
  createTaskSQL,
  deleteTaskSQL,
  editTaskSQL,
} = require("../SQL");

// ============================================================
// TASK DATABASE HANDLERS
// ============================================================

// GET COMPLETE TASK LIST
async function getTasks(user_id) {
  try {
    const result = await pool.query(getTasksSQL, [user_id]);
    return result.rows;
  } catch (error) {
    console.error("Error executing query in getTask:", error);
    throw error;
  }
}

// CREATE A NEW TASK
async function createTask(user_id, task) {
  try {
    const result = await pool.query(createTaskSQL, [user_id, task]);
    return result;
  } catch (error) {
    console.error("Error executing query in createTask:", error);
    throw error;
  }
}

// EDIT TASK NAME
async function editTask(task, task_id) {
  try {
    const result = await pool.query(editTaskSQL, [task, task_id]);
    return result;
  } catch (error) {
    console.error("Error executing query in editTask:", error);
    throw error;
  }
}

// TASK SOFT DELETE
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

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  editTask,
};
