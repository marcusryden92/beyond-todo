const cors = require("cors");
const bcrypt = require("bcrypt");
const express = require("express");
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

const {
  createTask,
  deleteTask,
  findUserByUsername,
  addUser,
  getTasks,
  editTask,
} = require("./handlers"); // Importing handlers

//==========================================

// Setting upp passport
async function verificationCallback(username, password, callback) {
  const user = await findUserByUsername(username);
  if (!user) {
    return callback(null, false, { message: "No user exists" });
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    return callback(null, false, { message: "Wrong password" });
  }
  return callback(null, user);
}

const strategy = new LocalStrategy(verificationCallback);
passport.use(strategy);

// Hexadecimal things
passport.serializeUser((user, callback) => {
  callback(null, user.username);
});

passport.deserializeUser(async (username, callback) => {
  console.log("deserialize", username);
  const user = await findUserByUsername(username);
  callback(null, user);
});

//==========================================

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://beyond-todo-client.vercel.app",
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
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use(passport.session());

function isAuth(req, res, next) {
  console.log("ISAUTH", req.isAuthenticated(), req.user);

  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
}

// Register a new user
app.post("/register", async (req, res) => {
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
});

// Login path + Authenticating a user
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.end();
});

app.get("/", (req, res) => {
  res.end();
});

// Getting Session
app.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    res.status(200).json({ status: 200, username: username }); // Return status and username
  } else {
    res.status(401).json({ status: 401, username: null }); // Return status and null username
  }
});

// Creating a task
app.post("/task", async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const task = req.body.task;
    await createTask(user_id, task);
    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the task" });
  }
});

app.put("/task", isAuth, async (req, res) => {
  const task_id = req.body.task_id; // Directly use task_id from req.body
  const task = req.body.task; // Directly use task from req.body

  try {
    await editTask(task, task_id);
    res.sendStatus(200); // Send success response
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).send("Internal Server Error"); // Send 500 error if editTask function fails
  }
});

// Deleting a task
app.delete("/task", isAuth, async (req, res) => {
  // Ensure req.body exists and has a task_id property
  if (!req.body || !req.body.task_id) {
    return res.status(400).send("Missing task_id in request body"); // Send 400 error if task_id is missing
  }

  const task_id = req.body.task_id; // Directly use task_id from req.body
  try {
    await deleteTask(task_id);
    res.sendStatus(200); // Send success response
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Internal Server Error"); // Send 500 error if deleteTask function fails
  }
});

app.post("/logout", (req, res) => {
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
});

// Getting User
app.get("/tasks", isAuth, async (req, res) => {
  const user_id = req.user.user_id;
  const tasks = await getTasks(user_id);
  res.json(tasks);
});

// setupRouting(app, createTask, readTasks);

app.listen(port, () => console.log(`Listening on port ${port}....`));

module.exports = app;
