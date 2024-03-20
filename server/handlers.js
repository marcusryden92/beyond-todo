// Create a todo
const pool = require("./db");

function createTask(task_id, user_id, text) {
  return async (req, res) => {
    const result = await pool.query(
      `INSERT INTO tasks (task_id, user_id, text) VALUES (?, ?, ?)`,
      [task_id, user_id, text]
    );
    return result;
  };
}

// function getTasks() {
//   return async (_, res) => {
//     try {
//       const tasks = await pool.query("SELECT * FROM tasks");
//       res.json(tasks.rows);
//     } catch (error) {
//       console.error(error);
//     }
//   };
// }

const getTasks = async (_, res) => {
  try {
    const tasks = await pool.query("SELECT * FROM tasks");
    res.json(tasks.rows);
    // const response = "Jesus";
    // res.json(response);
  } catch (error) {
    console.error(error);
  }
};

// app.post("/todos", async(req, res), () => {
//   const { task_id, user_id, text } = req.body;
//   createTask(task_id, user_id, text);
// });

module.exports = { getTasks, createTask };
