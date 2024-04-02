const pool = require("../db");

const { findUserByUsernameSQL, addUserSQL } = require("../SQL");

// ============================================================
// USER DATABASE HANDLERS
// ============================================================

// RETURN OBJECT OF USER ROW (USER OBJECT)
async function findUserByUsername(username) {
  try {
    const result = await pool.query(findUserByUsernameSQL, [username]);
    return result.rows[0]; // Assuming there's only one user with the provided username
  } catch (error) {
    console.error("Error executing query in findUseByUsername:", error);
    throw error;
  }
}

// CREATE A NEW USER
async function addUser(user) {
  try {
    const { user_id, username, hashedPassword } = user;
    await pool.query(addUserSQL, [user_id, username, hashedPassword]);
    return;
  } catch (error) {
    console.error("Error executing query in addUser", error);
    throw error;
  }
}

module.exports = {
  // createTask,
  findUserByUsername,
  addUser,
};
