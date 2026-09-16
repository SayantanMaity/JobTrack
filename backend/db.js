const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "987654321",
  database: "jobtrack_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error:", err);
    return;
  }

  console.log("MySQL Connected Successfully!");
});

module.exports = db;
