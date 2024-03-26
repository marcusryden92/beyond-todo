const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const {
  createTask,
  deleteTask,
  findUserByUsername,
  addUser,
  getTasks,
  editTask,
} = require("./handlers"); // Importing handlers

const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

// Login & Session
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//Hashing & Encrypting
const bcrypt = require("bcrypt");

// Generate random userId: --ADDED BY MARCUS
const { v4: uuidv4 } = require("uuid");

// Middlewears
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); //CHECK IF NEEDED WHEN DEPLOYED
app.use(bodyParser.json());

// Setting up & initializing session and initializing passport
app.use(
  session({
    cookie: { secure: false },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      sameSite: "lax",
    }, //never do this in prod, however localhost has no https
  })
);

// MARCUS logging function.
app.use((req, res, next) => {
  next();
});

app.use(passport.initialize());
app.use(passport.session());

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

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
  callback(null, user);
});

passport.deserializeUser(async (user, callback) => {
  callback(null, user);
});

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
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Server error during login.");
    }
    if (!user) {
      return res.status(401).json("Invalid username or password.");
    }
    req.logIn(user, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json("Server error during login.");
      }
      console.log("Successful login for: " + req.user.username);
      return res.json("Welcome " + req.user.username);
    });
  })(req, res, next);
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
app.post("/task", isAuth, async (req, res) => {
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
