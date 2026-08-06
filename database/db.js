const mysql = require("mysql2");

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

module.exports = connection;