const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

function setupRouting(app, createTask, readTasks) {
  app.post("/todos", createTask);
  app.get("/todos", readTasks);

}

module.exports = { app, setupRouting };
