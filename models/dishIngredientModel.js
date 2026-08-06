const db = require("../database/db");

exports.getDishes=(callback)=> {
    const sql = "Select * from dishes";
    db.query(sql,callback);
};

exports.getIngredients=(callback)=> {
    const sql = "Select * from Ingredients";
    db.query(sql,callback);
};

exports.addDishIngredient=(dishId,ingredientId,quantity,callback)=> {
     const sql = `
        INSERT INTO DishIngredients(dishId,ingredientId,quantity)
        VALUES (?, ?, ?)
    `;

    db.query(sql,[dishId, ingredientId, quantity],callback);
}

exports.getIngredientsByDishId = ( dishId,callback) => {

    const sql = `
        SELECT
            di.IngredientID,i.IngredientName,di.Quantity
        FROM DishIngredients di
        JOIN Ingredients i
            ON di.IngredientID = i.IngredientID
        WHERE di.DishID = ?
    `;

    db.query(sql,[dishId],callback);
}

exports.deleteDishIngredients = (dishId, callback) => {

    const sql = `DELETE FROM DishIngredients WHERE DishID = ?`;

    db.query(sql, [dishId], callback);

};

exports.checkIngredientUsage = (ingredientId, callback) => {
    const sql = 'select * from DishIngredients where ingredientID = ?'

    db.query(sql,[ingredientId],callback)
};

