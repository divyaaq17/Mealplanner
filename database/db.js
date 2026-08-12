/* const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123",
    database: "mealplanner"
});

connection.connect((err) => {
    if (err) {
        console.error("Connection failed!");
        console.error(err);
        return;
    }

    console.log("Database connected successfully!");
});

module.exports = connection; */


require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed:");
        console.log(err);
    } else {
        console.log("Connected to Railway MySQL");
        connection.release();
    }
});

module.exports = db;