const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");

app.use(cors());

// app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    const tasks = await pool.query("SELECT * FROM tasks");
    res.json(tasks.rows);
  } catch (error) {
    console.error(error);
  }
});

async function createTask(task_id, user_id, text) {
  const result = await pool.query(
    `INSERT INTO tasks (task_id, user_id, text) VALUES (?, ?, ?)`,
    [task_id, user_id, text]
  );
  return result;
}
// you can separate the code even more
// Id can be a string - think security
// JOI - library
// Create a new task
// separate things into functions - scopes book - hoisting
app.post("/todos", async(req, res), () => {
  const { task_id, user_id, text } = req.body;
  createTask(task_id, user_id, text);
});

app.post("/todos", async (req, res) => {
  try {
    const tasks = await pool.query("SELECT * FROM tasks");
    res.json(tasks.rows);
  } catch (error) {
    console.error(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));

// Create a user
// Create a new task
// "Delete" a new task - change the boolean
// Edit a task
// Get the task for a specifc user

// Authentication
// Create a new user
// Check if user is valid

// *************************
// USER AUTHENTICATION LOGIC
// *************************



const addNewUser = (req, res,) => {

// get the user from the req
// ask for that name in database ? respond with error : add to table



// const numberofUsers = SELECT COUNT(*) FROM user_id;
// const user_id = numberofUsers + 1;
// const user_name = req.name
// const user_password =

};


app.post("/todo", addNewUser);
app.get("/todo", handleGet);
app.put("/todo", handlePut);
app.delete("/todo", handleDelete);

// const function POST that creates new user (if not allready used username) {
// user_id user_name password

// If authorized hash the password and pass it to database.
