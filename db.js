const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'paula.huertas310',
  password: 'MIMLABcata2025*',
  database: 'disponibilidad'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = db;
