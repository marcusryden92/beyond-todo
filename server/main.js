const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const { createTask, readTasks, findUserByUsername, addUser, getTasks } = require("./handlers"); // Importing handlers
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
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
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
async function verificationCallback(username, password, callback) {
	const user = await findUserByUsername(username);
	const matchedPassword = await bcrypt.compare(password, user.password);

	if (!user) {
		return callback(null, false, { message: "No user exists" });
	}

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
	//const user = await findUserByUsername(user_name);
	callback(null, user);
});

// Register a new user
app.post("/register", async (req, res) => {
	const { username, password } = req.body;

	if (await findUserByUsername(username)) {
		console.log("user already exist");
		return res.status(409).json("User already exists.");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user_id = uuidv4(); // --ADDED BY MARCUS

	const user = { user_id, username, hashedPassword };
	console.log(user);
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

// Getting User
app.get("/tasks", async (req, res) => {
	// res.status(200).json("worked");
	// const { user_name } = req.cookies;
	// console.log(user_name);
});

setupRouting(app, createTask, readTasks);

app.listen(port, () => console.log(`Listening on port ${port}....`));
