require('dotenv').config();
const mysql = require('mysql');

async function createDatabaseConnection() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: process.env.DB_CHARSET,
  });

  return db;
}

module.exports = createDatabaseConnection;