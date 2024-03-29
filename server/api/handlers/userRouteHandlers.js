const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const { findUserByUsername, addUser } = require("./databaseHandlers"); // Importing handlers

async function handleRegister(req, res) {
  try {
    const { username, password } = req.body;

    if (await findUserByUsername(username)) {
      console.log("user already exist");
      return res.status(409).json("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user_id = uuidv4(); // --ADDED BY MARCUS

    const user = { user_id, username, hashedPassword };
    addUser(user);

    res.status(201).json("User registered successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error during registration.");
  }
}

function handleLogout(req, res) {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json("Server error during logout.");
    }
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json("Server error during logout.");
      }
      res.send(); // send to the client
    });
  });
}

function handleSession(req, res) {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    res.status(200).json({ status: 200, username: username }); // Return status and username
  } else {
    res.status(401).json({ status: 401, username: null }); // Return status and null username
  }
}

module.exports = {
  handleRegister,
  handleSession,
  handleLogout,
};
