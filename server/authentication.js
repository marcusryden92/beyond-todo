
// Import required modules
const express = require("express"); // This line imports Express.js, a framework for building web applications.
const cors = require("cors"); // This line imports middleware for enabling Cross-Origin Resource Sharing (CORS).
const bodyParser = require("body-parser"); // This line imports middleware for parsing JSON request bodies.
const session = require("express-session"); // This line imports middleware for managing user sessions.
const passport = require("passport"); // This line imports middleware for authentication.

const LocalStrategy = require("passport-local").Strategy; // This line imports the local authentication strategy for Passport.js.
const bcrypt = require("bcrypt"); // This line imports a library for securely hashing passwords.

// TODO: import handlers
const { addUser, findUser, findUserByUsername } = require("./fakeDatabase"); // This line imports functions for interacting with a fake database.

const app = express(); // This line creates an instance of the Express application.
const PORT = 8080; // This line sets the port number on which the server will run.

// Middleware setup

// TODO - CHECK THIS PART
// This line configures Cross-Origin Resource Sharing (CORS) middleware to allow requests from a specific origin.
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// This line configures middleware for parsing JSON request bodies.
app.use(bodyParser.json());

// This line configures middleware for managing user sessions, such as setting session cookies.
app.use(
  session({
    // This is a secret key used to sign the session ID cookie.
    secret: "secret",

    // This option prevents saving the session on every request.
    resave: false,

    // This option prevents saving uninitialized sessions.
    saveUninitialized: false,

    // This configures session cookies, allowing them to be sent over non-HTTPS connections. WHEN DEPLOYED CHANGE TO TRUE
    cookie: { secure: false, sameSite: "none" },
  })
);

// This line initializes Passport authentication middleware.
app.use(passport.initialize());
// This line configures Passport to use sessions for authentication.
app.use(passport.session());

// Passport setup
// This block configures a local authentication strategy for Passport, which involves verifying user credentials.
passport.use(
  new LocalStrategy(async (username, password, done) => {
    // This line finds a user in the fake database by username.
    const user = await findUserByUsername(username); 
    if (!user) {
      return done(null, false, { message: "No user exists" }); // This line returns an error if the user does not exist.
    }
    const matchedPassword = await bcrypt.compare(password, user.password); // This line compares the provided password with the hashed password stored in the database.
    if (!matchedPassword) {
      return done(null, false, { message: "Wrong password" }); // This line returns an error if the password is incorrect.
    }
    return done(null, user); // This line indicates successful authentication.
  })
);
// This line serializes the user object to store in the session.
passport.serializeUser((user, done) => {
  done(null, user.username); // This line stores the username in the session.
});
// This line deserializes the user object from the session.
passport.deserializeUser(async (username, done) => {
  const user = await findUserByUsername(username); // This line finds the user by username in the fake database.
  done(null, user); // This line returns the user object.
});


// Routes setup
// This block defines routes for handling user registration, login, profile retrieval, session status check, and logout.
// Handles user registration by extracting username and password from the request body, hashing the password, and adding the user to the fake database.
app.post("/register", async (req, res) => {
  //
  console.log(req.body);

  const { username, password } = req.body;
  if (findUser(username)) {
    console.log("user already exist");
    return res.status(500).json("User already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = { username, password: hash };
  addUser(user); // SEND DOWN USERNAME AND HASHED PASSWORD TO DATABASE (SQL)

  res.status(201).json("User registered successfully.");
});



// Handles user login by authenticating the user using Passport local authentication strategy.
app.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Successful login for: " + req.user.username);
  res.json("Welcome " + req.user.username);
});



// Retrieves user profile information if the user is authenticated.
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.json(req.user);
  } else {
    res.status(401).json("Unauthorized");
  }
});



// Checks session status to determine if the user is authenticated.
app.get("/session", (req, res) => {
  // Code for checking session status...
});
// Handles user logout by logging out the user and ending the session.
app.get("/logout", (req, res) => {
  // Code for user logout...
});
// Starts the server and listens on the specified port.
app.listen(PORT, () => {
  console.log("Server running on port:" + PORT); // This line logs a message indicating that the server is running.
});
