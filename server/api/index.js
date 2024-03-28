const express = require("express");
const dotenv = require("dotenv");
const { setupRouting } = require("./express");

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  const app = express();

  setupRouting(app);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}....`));
}

main();
