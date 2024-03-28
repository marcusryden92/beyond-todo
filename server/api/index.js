const express = require("express");
require("dotenv").config();

const { setupRouting } = require("./express");

const PORT = process.env.PORT || 3000;

async function main() {
  const app = express();

  setupRouting(app);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}....`));
}

main();

module.exports = app;
