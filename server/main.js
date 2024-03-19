const express = require("express");
const cors = require("cors");
const { createTask, getTasks } = require("./handlers"); // Import handlers
const { setupRouting } = require("./express"); // Assuming express.js file contains setupRouting function
const pool = require("./db"); // Assuming db.js contains database setup

const app = express();

app.use(cors());
app.use(express.json());


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));

setupRouting(createTask, getTasks);


