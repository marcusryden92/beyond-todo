const findUserByUsernameSQL = `
SELECT * FROM users WHERE username = $1
`;

const addUserSQL = `
INSERT INTO users (user_id, username, password) 
VALUES ($1, $2, $3)
`;

module.exports = {
  findUserByUsernameSQL,
  addUserSQL,
};
