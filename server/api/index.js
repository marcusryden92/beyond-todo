const express = require("express");
const { setupRouting } = require("./express");

const PORT = process.env.PORT || 3000;

async function main() {
  const app = express();


  setupRouting(app);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}....`));
}

main();
