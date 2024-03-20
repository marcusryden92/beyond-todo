// const express = require("express");
// const app = express();
// const pool = require("./db");
// const cors = require("cors");

// app.use(cors());

// // app.use(express.json());

// // Read all todos 
// app.get("/todos", async (req, res) => {
//   try {
//     const tasks = await pool.query("SELECT * FROM tasks");
//     res.json(tasks.rows);
//   } catch (error) {
//     console.error(error);
//   }
// });

// // Create a todo
// async function createTask(task_id, user_id, text) {
//   const result = await pool.query(
//     `INSERT INTO tasks (task_id, user_id, text) VALUES (?, ?, ?)`,
//     [task_id, user_id, text]
//   );
//   return result;
// }

// // Delete todo
// app.post("/todos/:id", async (req, res) => {
//   const id = req.params
//   try {
//     await pool.query('DELETE FROM todos WHERE id = $1', [id]);
//   } catch (error) {
//     console.error(error);
//   }
// });


// // Update todo
// // ------> <---------





// app.post("/todos", async(req, res), () => {
//   const { task_id, user_id, text } = req.body;
//   createTask(task_id, user_id, text);
// });


// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}....`));


