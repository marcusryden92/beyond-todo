const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const {
  createTask,
  readTasks,
  findUserByUsername,
  addUser,
} = require("./handlers"); // Importing handlers
const { setupRouting } = require("./express");
const pool = require("./db");

const bodyParser = require("body-parser");

// Login & Session
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//Hashing & Encrypting
const bcrypt = require("bcrypt");

// Middlewears
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); //CHECK IF NEEDED WHEN DEPLOYED
app.use(bodyParser.json());

// Setting up & initializing session and initializing passport
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "none" }, //never do this in prod, however localhost has no https
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Setting upp passport
passport.use(
  new LocalStrategy(async (user_name, password, callback) => {
    //
    const user = await findUserByUsername(user_name);
    if (!user) {
      return callback(null, false, { message: "No user exists" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return callback(null, false, { message: "Wrong password" });
    }
    return callback(null, user);
  })
);

// Hexdecimal things
passport.serializeUser((user, callback) => {
  callback(null, user.user_name);
});

passport.deserializeUser(async (username, callback) => {
  const user = await findUserByUsername(username);
  callback(null, user);
});

// Register a new user

app.post("/register", async (req, res) => {
  //
  console.log("hello");

  const { newUsername, newPassword } = req.body;

  if (await findUserByUsername(newUsername)) {
    console.log("user already exist");
    return res.status(409).json("User already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const user = { user_id: "2", newUsername, hashedPassword };
  addUser(user);

  res.status(201).json("User registered successfully.");
});

// Login path + Authenticating a user
app.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Successful login for: " + req.user.username);
  res.json("Welcome " + req.user.username);
});

// Getting Session
app.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json("Authorized ");
  } else {
    res.status(401).json("Unauthorized");
  }
});

setupRouting(app, createTask, readTasks);

app.listen(port, () => console.log(`Listening on port ${port}....`));
