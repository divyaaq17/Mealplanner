const db = require("../database/db"); //loads myspl connection

exports.getAllDishes = (search, limit, offset, callback) => {

    let sql = `
        SELECT *
        FROM Dishes
    `;

    const params = [];

    if (search) {
        sql += " WHERE DishName LIKE ?";
        params.push("%" + search + "%");
    }

    sql += " ORDER BY DishName LIMIT ? OFFSET ?";

    params.push(limit);
    params.push(offset);

    db.query(sql, params, callback);

};
exports.getDishCount = (search, callback) => {

    let sql = `
        SELECT COUNT(*) AS total
        FROM Dishes
    `;

    const params = [];

    if (search) {

        sql += " WHERE DishName LIKE ?";

        params.push("%" + search + "%");

    }

    db.query(sql, params, callback);

};
exports.addDish = (dishName, recipe, callback) => {

    const sql = `INSERT INTO Dishes(DishName, Recipe) VALUES (?, ?)`; //'?'->This prevents SQL injection and is the proper way to pass values.

    db.query(sql,[dishName, recipe],callback);
};

exports.getDishById = (dishId,callback) => {

    const sql = `SELECT * FROM Dishes WHERE DishID = ?`;

    db.query(sql,[dishId],callback);

};
exports.updateDish = (dishId, dishName, recipe, callback) => {
    const sql = `UPDATE Dishes
        SET DishName = ?, recipe = ?
        WHERE DishID = ?`;

    db.query(sql, [dishName, recipe, dishId], callback);
};

exports.deleteDish = (dishId, callback) => {
    const sql = "DELETE FROM Dishes WHERE DishID = ?";
    db.query(sql, [dishId], callback);
};



exports.toggleFavorite = (dishId, callback) => {

    const sql = `
        UPDATE Dishes
        SET IsFavorite = NOT IsFavorite
        WHERE DishID = ?
    `;

    db.query(sql, [dishId], callback);

};
exports.getFavoriteDishes = (callback) => {

    const sql = `
        SELECT DishID, DishName
        FROM Dishes
        WHERE IsFavorite = 1
        ORDER BY DishName
    `;

    db.query(sql, callback);

};