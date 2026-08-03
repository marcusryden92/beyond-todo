const taskHandlers = require("./handlers/taskHandlers");
const userHandlers = require("./handlers/userHandlers");
const { isAuth } = require("./passport");

const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");

function setupRouting(app) {
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

  app.post("/register", userHandlers.handleRegister);
  app.post("/login", passport.authenticate("local"), (_, res) => {
    res.end();
  });
  app.post("/logout", userHandlers.handleLogout);
  app.get("/session", userHandlers.handleSession);
  app.delete("/account", isAuth, userHandlers.handleDeleteAccount);

  // TASK ROUTES
  app.post("/task", isAuth, taskHandlers.handlePostTask);
  app.put("/task", isAuth, taskHandlers.handlePutTask);
  app.delete("/task", isAuth, taskHandlers.handleDeleteTask);
  app.get("/tasks", isAuth, taskHandlers.handleGetTaskList);
}

module.exports = { setupRouting };
