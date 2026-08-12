const db = require("../database/db");

exports.getAllIngredients = (search, limit, offset, callback) => {

    let sql = `
        SELECT *
        FROM Ingredients
    `;

    const params = [];

    if (search) {
        sql += " WHERE IngredientName LIKE ?";
        params.push("%" + search + "%");
    }

    sql += " ORDER BY IngredientName LIMIT ? OFFSET ?";

    params.push(limit);
    params.push(offset);

    db.query(sql, params, callback);

};
exports.getAllIngredientsForDropdown = (callback) => {

    const sql = `
        SELECT *
        FROM Ingredients
        ORDER BY IngredientName
    `;

    db.query(sql, callback);

};

exports.getIngredientCount = (search, callback) => {

    let sql = `
        SELECT COUNT(*) AS total
        FROM Ingredients
    `;

    const params = [];

    if (search) {
        sql += " WHERE IngredientName LIKE ?";
        params.push("%" + search + "%");
    }

    db.query(sql, params, callback);

};

exports.addIngredient = (IngredientName,callback) => {
    const sql = "Insert into Ingredients (IngredientName) values (?)";
    db.query(sql,[IngredientName],callback);
};
exports.deleteIngredient = (ingredientId, callback) => {
    const sql = "DELETE FROM Ingredients WHERE IngredientID = ?";
    db.query(sql, [ingredientId], callback);
};
