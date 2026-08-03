const findUserByUsernameSQL = `
SELECT * FROM users WHERE username = $1
`;

const addUserSQL = `
INSERT INTO users (user_id, username, password) 
VALUES ($1, $2, $3)
`;

const deleteUserSQL = `
DELETE FROM users WHERE user_id = $1
`;

module.exports = {
  findUserByUsernameSQL,
  addUserSQL,
  deleteUserSQL,
};
