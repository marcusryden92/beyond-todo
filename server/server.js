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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));
