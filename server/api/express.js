const taskRouteHandlers = require("./handlers/taskRouteHandlers");
const userRouteHandlers = require("./handlers/userRouteHandlers");
const { isAuth } = require("./passport");

const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");

function setupRouting(app) {
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
      sameSite: "none",
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
