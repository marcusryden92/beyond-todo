const taskRouteHandlers = require("./handlers/taskRouteHandlers");
const userRouteHandlers = require("./handlers/userRouteHandlers");
const { findUserByUsername } = require("./handlers/databaseHandlers"); // Importing handlers

const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

function setupRouting(app) {
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

  // APP USE

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

  // USER ROUTES

  app.get("/", (_, res) => {
    res.end();
  });

  app.post("/register", userRouteHandlers.handleRegister);

  app.post("/login", passport.authenticate("local"), (_, res) => {
    res.end();
  });

  app.post("/logout", userRouteHandlers.handleLogout);

  app.get("/session", userRouteHandlers.handleSession);

  // TASK ROUTES

  app.post("/task", taskRouteHandlers.handlePostTask);

  app.put("/task", isAuth, taskRouteHandlers.handlePutTask);

  app.delete("/task", isAuth, taskRouteHandlers.handleDeleteTask);

  app.get("/tasks", isAuth, taskRouteHandlers.handleGetTaskList);
}

module.exports = { setupRouting };
