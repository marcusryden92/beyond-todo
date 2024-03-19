const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

function setupRouting(createTask, getTasks) {
  app.post("/todos", createTask);
  app.get("/todos", getTasks);
}

module.exports = { app, setupRouting };
