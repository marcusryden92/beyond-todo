const {
  createTask,
  deleteTask,
  getTasks,
  editTask,
} = require("../models/taskModel"); // Importing handlers

async function handlePostTask(req, res) {
  try {
    console.log(req.user);
    const user_id = req.user.user_id;
    const task = req.body.task;
    await createTask(user_id, task);
    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the task" });
  }
}

async function handlePutTask(req, res) {
  const task_id = req.body.task_id; // Directly use task_id from req.body
  const task = req.body.task; // Directly use task from req.body

  try {
    await editTask(task, task_id);
    res.sendStatus(200); // Send success response
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).send("Internal Server Error"); // Send 500 error if editTask function fails
  }
}

async function handleDeleteTask(req, res) {
  // Ensure req.body exists and has a task_id property
  if (!req.body || !req.body.task_id) {
    return res.status(400).send("Missing task_id in request body"); // Send 400 error if task_id is missing
  }

  const task_id = req.body.task_id; // Directly use task_id from req.body
  try {
    await deleteTask(task_id);
    res.sendStatus(200); // Send success response
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Internal Server Error"); // Send 500 error if deleteTask function fails
  }
}

async function handleGetTaskList(req, res) {
  const user_id = req.user.user_id;
  const tasks = await getTasks(user_id);
  res.json(tasks);
}

module.exports = {
  handlePostTask,
  handlePutTask,
  handleDeleteTask,
  handleGetTaskList,
};
