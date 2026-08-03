const pool = require("../db");

const {
  findUserByUsernameSQL,
  addUserSQL,
  deleteUserSQL,
} = require("../queries/userQueries");

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

// DELETE A USER (their tasks are removed automatically via ON DELETE CASCADE)
async function deleteUser(user_id) {
  try {
    await pool.query(deleteUserSQL, [user_id]);
    return;
  } catch (error) {
    console.error("Error executing query in deleteUser:", error);
    throw error;
  }
}

module.exports = {
  findUserByUsername,
  addUser,
  deleteUser,
};
