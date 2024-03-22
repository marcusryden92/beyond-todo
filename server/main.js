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

// Generate random userId: --ADDED BY MARCUS
const { v4: uuidv4 } = require("uuid");

// Middlewears
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); //CHECK IF NEEDED WHEN DEPLOYED
app.use(bodyParser.json());

// Setting up & initializing session and initializing passport

// *****************
// *****************
//
// MARCUS: Set maxAge of cookie to 1 day (the math equates to nr of ms in a day.)
//
// *****************
// *****************

app.use(
  session({
    secret: "secret",
    resave: false,

    saveUninitialized: false,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24,

      secure: false,
      sameSite: "none",
    }, //never do this in prod, however localhost has no https
  })
);

// MARCUS logging function.

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Setting upp passport

// *****************
// *****************
//
// MARCUS:  Changed variable "user_name" to "username", because according to tutorial,
//          Passport looks for the "username" variable in our HTTP request when doing
//          authentication stuff. Also changed this in the Client-side createUser function
//          and in the register function below, although it probably doesn't matter.
//          Have not touched the database.
//
//          I have also separated the functions a little bit to make them more comprehensible,
//          but functionality remains the same.
//
// *****************
// *****************

async function verificationCallback(username, password, callback) {
  //
  //
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

  const { username, password } = req.body;

  if (await findUserByUsername(username)) {
    console.log("user already exist");
    return res.status(409).json("User already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user_id = uuidv4(); // --ADDED BY MARCUS

  const user = { user_id: user_id, user_name: username, hashedPassword };
  addUser(user);

  res.status(201).json("User registered successfully.");
});

// Login path + Authenticating a user
app.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Successful login for: " + req.user.user_name);
  res.json("Welcome " + req.user.user_name);
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
