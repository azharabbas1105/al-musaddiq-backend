require('dotenv').config();
module.exports = {
  // HOST: "127.0.0.1",
  // PORT: 27017,
  // DB: "az_db"
  HOST:process.env.HOST,
  PORT: process.env.DB_PORT,
  DB: process.env.DB
};