const db = require("../database/db");

exports.getDishes = (callback) => {
    const sql = "SELECT * FROM Dishes ORDER BY DishName";
    db.query(sql, callback);
};

exports.addMeal = (mealDate, mealType, dishId, callback) => {

    const sql = `
        INSERT INTO MealPlans (MealDate, MealType, DishID)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [mealDate, mealType, dishId], callback);

};

exports.getMealsByDate = (mealDate, callback) => {

    const sql = `
        SELECT
    m.MealDate AS mealDate,
    m.MealType AS mealType,
    m.DishID,
    d.DishName AS dishName
FROM MealPlans m
INNER JOIN Dishes d
ON m.DishID = d.DishID
WHERE m.MealDate = ?
    `;

    db.query(sql, [mealDate], callback);

};

exports.deleteMealsByDate = (mealDate, callback) => {

    const sql = `
        DELETE FROM MealPlans
        WHERE MealDate = ?
    `;

    db.query(sql, [mealDate], callback);

};

exports.getShoppingListByDate = (mealDate, callback) => {

    const sql = `
        SELECT
            d.DishName,
            i.IngredientName,
            di.Quantity,
            m.MealType
        FROM MealPlans m
        INNER JOIN Dishes d
            ON m.DishID = d.DishID
        INNER JOIN DishIngredients di
            ON d.DishID = di.DishID
        INNER JOIN Ingredients i
            ON di.IngredientID = i.IngredientID
        WHERE m.MealDate = ?
    `;

    db.query(sql, [mealDate], callback);

};

exports.getWeeklyMeals = (firstMealDate, secMealDate, callback) => {

    const sql = `
        SELECT
    m.MealDate AS mealDate,
    m.MealType AS mealType,
    m.DishID,
    d.DishName AS dishName
FROM MealPlans m
INNER JOIN Dishes d
    ON m.DishID = d.DishID
WHERE m.MealDate BETWEEN ? AND ?
ORDER BY m.MealDate, m.MealType;
    `;

    db.query(sql, [firstMealDate, secMealDate], callback);

};

exports.getDashboardStats = (callback) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM Dishes) AS totalDishes,
            (SELECT COUNT(*) FROM Ingredients) AS totalIngredients,
            (SELECT COUNT(*) FROM MealPlans) AS totalMealPlans
    `;

    db.query(sql, callback);

};

exports.getTodaysMeals = (mealDate, callback) => {

    const sql = `
        SELECT
            m.MealType,
            d.DishName
        FROM MealPlans m
        INNER JOIN Dishes d
            ON m.DishID = d.DishID
        WHERE m.MealDate = ?
        ORDER BY FIELD(m.MealType,'Breakfast','Lunch','Dinner')
    `;

    db.query(sql, [mealDate], callback);

};

/* ===========================
   Dashboard Statistics
=========================== */

exports.getFavouriteCount = (callback) => {

    const sql = `
        SELECT COUNT(*) AS favouriteCount
        FROM Dishes
        WHERE IsFavorite = 1
    `;

    db.query(sql, callback);

};

exports.getMostPlannedDish = (callback) => {

    const sql = `
        SELECT
            d.DishName,
            COUNT(*) AS totalPlans
        FROM MealPlans m
        INNER JOIN Dishes d
            ON m.DishID = d.DishID
        GROUP BY d.DishID
        ORDER BY totalPlans DESC
        LIMIT 1
    `;

    db.query(sql, callback);

};

exports.getMealsThisWeek = (callback) => {

    const sql = `
        SELECT
            COUNT(*) AS mealsThisWeek
        FROM MealPlans
        WHERE MealDate
        BETWEEN CURDATE()
        AND DATE_ADD(CURDATE(), INTERVAL 6 DAY)
    `;

    db.query(sql, callback);

};