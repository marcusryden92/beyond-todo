import {
  handlePostTask,
  handlePutTask,
  handleDeleteTask,
  handleGetTaskList,
} from "./handlers/taskRouteHandlers";

import {
  handleRegister,
  handleSession,
  handleLogout,
} from "./handlers/userRouteHandlers";

const bodyParser = require("body-parser");
const session = require("express-session");

const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

function setupRouting(app) {
  //
  //
  // ============================================================
  // AUTHENTICATION
  // ============================================================

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

  // Hexadecimal things
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

  // ============================================================
  // APP USE
  // ============================================================

  app.use(
    cors({
      origin: process.env.ORIGINURL,
      credentials: true,
    })
  );

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.session());

  // ============================================================
  // USER ROUTES
  // ============================================================

  app.get("/", (_, res) => {
    res.end();
  });

  app.post("/register", handleRegister);

  app.post("/login", passport.authenticate("local"), (_, res) => {
    res.end();
  });

  app.post("/logout", handleLogout);

  // Getting Session
  app.get("/session", handleSession);

  // ============================================================
  // TASK ROUTES
  // ============================================================

  // Creating a task
  app.post("/task", handlePostTask);

  // Editing a task
  app.put("/task", isAuth, handlePutTask);

  // Deleting a task
  app.delete("/task", isAuth, handleDeleteTask);

  // Getting complete user task list
  app.get("/tasks", isAuth, handleGetTaskList);
}

module.exports = { setupRouting };
