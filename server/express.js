const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

function setupRouting(app, createTask, getTasks) {
  app.post("/todos", createTask);
  app.get("/todos", getTasks);

  app.post("/login", passport.authenticate("local"), (req, res) => {});
}

module.exports = { app, setupRouting };
