const db = require("../database/db");

exports.addUser = (userName, email, password, callback) => {

    const sql = `
    INSERT INTO Users(UserName, Email, Password)
    VALUES(?,?,?)
    `;

    db.query(sql, [userName, email, password], callback);

};

exports.getUserByEmail = (email, callback) => {

    const sql = `
    SELECT *
    FROM Users
    WHERE Email = ?
    `;

    db.query(sql, [email], callback);

};