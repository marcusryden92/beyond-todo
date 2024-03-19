const pool = require("./db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Passport middleware setup
passport.use(
  new LocalStrategy(function verify(username, password, callback) {
    pool
      .query("SELECT * FROM users WHERE username = $1", [username])
      .then((user) => {

        // If no user is found, return error
        if (!user) {
          return callback(null, false, { message: "No user found" });
        }

        // If username doesn't match, return error
        if (user.name != user) {
          return callback(null, false, { message: "Incorrect username" });
        }

        // If everything is correct, return user
        callback(null, { user_id: user_id });
      })
      .catch((err) => {
        // If there's an error, return it
        callback(err, null);
      });
  })
);


//======================================================

const app = express();

app.post("/login", passport.authenticate("local"));

app.get("/user", (req, res) => {
  res.status(200).json({ user_id: 1 });
});

//======================================================

const response = await fetch("/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username: "user", password: "password" }),
});

const body = await response.json();
Router("/dash");










// const function POST that creates new user (if not allready used username) {
// user_id user_name password

// If authorized hash the password and pass it to database.

// var passport = require("passport");
// var LocalStrategy = require("passport-local");

// passport.use(
//   new LocalStrategy(function verify(user_name, password, cb) {
//     pool.query(
//       "SELECT * FROM users WHERE user_name = ?",
//       [user_name],
//       function (err, user) {
//         if (err) {
//           return cb(err);
//         }
//         if (!user) {
//           return cb(null, false, {
//             message: "Incorrect username or password.",
//           });
//         }

//         crypto.pbkdf2(
//           password,
//           user.salt,
//           310000,
//           32,
//           "sha256",
//           function (err, hashedPassword) {
//             if (err) {
//               return cb(err);
//             }
//             if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
//               return cb(null, false, {
//                 message: "Incorrect username or password.",
//               });
//             }
//             return cb(null, user);
//           }
//         );
//       }
//     );
//   })
// );

// app.post(
//   "/login/password",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );

// Authentication
// Create a new user
// Check if user is valid

// *************************
// USER AUTHENTICATION LOGIC
// *************************

// const addNewUser = (req, res) => {
//   get the user from the req
//   ask for that name in database ? respond with error : add to table
//   const numberofUsers = SELECT COUNT(*) FROM user_id;
//   const user_id = numberofUsers + 1;
//   const user_name = req.name
//   const user_password =
// };
