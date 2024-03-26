const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const passport = require("passport");
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());

const taskRoutes = require("./taskRoutes");

const session = require("express-session");
const { findUserByUsername, addUser } = require("./handlers"); // Importing handlers
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
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
    },
  })
);

const strategy = new LocalStrategy(verificationCallback);
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

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

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser(async (user, callback) => {
  callback(null, user);
});

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

app.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    res.status(200).json({ status: 200, username: username }); // Return status and username
  } else {
    res.status(401).json({ status: 401, username: null }); // Return status and null username
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
      res.send();
    });
  });
});

app.use("/", taskRoutes);
app.listen(port, () => console.log(`Listening on port ${port}....`));
