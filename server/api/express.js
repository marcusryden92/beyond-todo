const taskRouteHandlers = require("./handlers/taskRouteHandlers");
const userRouteHandlers = require("./handlers/userRouteHandlers");
const { findUserByUsername } = require("./handlers/databaseHandlers"); // Importing handlers

const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcrypt");

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

  // Trust the Render/Vercel proxy so `secure` cookies survive HTTPS termination.
  app.set("trust proxy", 1);

  // Accept one or more front-end origins (comma-separated), tolerant of a
  // trailing slash — the silent mismatch that usually breaks credentialed CORS.
  const allowedOrigins = (process.env.ORIGINURL || "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // No Origin header (curl, health checks, same-origin) → allow.
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
          return callback(null, true);
        }
        console.warn(`Blocked by CORS: ${origin}`);
        return callback(null, false);
      },
      credentials: true,
    }),
  );

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const isProd = process.env.NODE_ENV === "production";
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax", // "none" lets the cookie travel cross-site in prod
        secure: isProd, // required whenever sameSite is "none"; both ends are HTTPS in prod
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  );

  app.use(passport.initialize());
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
  app.delete("/account", isAuth, userRouteHandlers.handleDeleteAccount);

  // TASK ROUTES
  app.post("/task", isAuth, taskRouteHandlers.handlePostTask);
  app.put("/task", isAuth, taskRouteHandlers.handlePutTask);
  app.delete("/task", isAuth, taskRouteHandlers.handleDeleteTask);
  app.get("/tasks", isAuth, taskRouteHandlers.handleGetTaskList);
}

module.exports = { setupRouting };
