const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { Pool } = require('pg');
import pool from './db';

const app = express();
app.use(bodyParser.json());

// Passport configuration
passport.use(new LocalStrategy(
  function(username, password, done) {
    pool.query(
      'SELECT * FROM users WHERE user_name = $1',
      [username],
      (err, results) => {
        if (err) {
          return done(err);
        }
        if (results.rows.length === 0) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        const user = results.rows[0];
        // Perform password hashing and comparison
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
          if (err) {
            return done(err);
          }
          if (!crypto.timingSafeEqual(Buffer.from(user.hashed_password, 'base64'), hashedPassword)) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }
          return done(null, user);
        });
      }
    );
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id],
    (err, results) => {
      if (err) {
        return done(err);
      }
      const user = results.rows[0];
      done(null, user);
    }
  );
});

// Login route
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Authentication successful', user: req.user });
});

// Registration route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists in the database
  pool.query(
    'SELECT * FROM users WHERE user_name = $1',
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (results.rows.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Generate salt and hash the password
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: 'Internal server error' });
        }

        // Insert the new user into the database
        pool.query(
          'INSERT INTO users (user_name, hashed_password, salt) VALUES ($1, $2, $3)',
          [username, hashedPassword.toString('base64'), salt],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
          }
        );
      });
    }
  );
});

// Example protected route
app.get('/protected', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Protected route accessed', user: req.user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
