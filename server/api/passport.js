const { findUserByUsername } = require("./handlers/databaseHandlers"); // Importing handlers

const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const passport = require("passport");

// AUTHENTICATION

async function verificationCallback(username, password, callback) {
  const user = await findUserByUsername(username);
  if (!user) {
    return callback(null, false, { message: "No user exists" });
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    return callback(null, false, { message: "Wrong password" });
  }
  console.log("VC", user);
  return callback(null, user);
}

const strategy = new LocalStrategy(verificationCallback);
passport.use(strategy);

passport.serializeUser(({ username, user_id }, callback) => {
  console.log("Serializeuser: ", username, " ", user_id);
  callback(null, JSON.stringify({ username, user_id }));
});

passport.deserializeUser(async (data, callback) => {
  console.log("Deserializeuser: ", data);
  const user = JSON.parse(data);
  callback(null, user);
});

function isAuth(req, res, next) {
  console.log("ISAUTH", req.isAuthenticated(), req.user);

  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
}

module.exports = { isAuth };
