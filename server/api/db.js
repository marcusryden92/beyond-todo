const Pool = require("pg").Pool;
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.DBUSERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DBPORT,
  database: "group5",
});

module.exports = pool;
