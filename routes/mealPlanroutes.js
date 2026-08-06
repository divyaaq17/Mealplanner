const express = require("express");
const router = express.Router();
const mealPlanController = require("../controllers/mealPlanController")
const authMiddleware = require("../middleware/authMiddleware");

router.get("/mealPlanner",authMiddleware.isAuthenticated, mealPlanController.showMealPlanner);
router.get("/shoppingList",authMiddleware.isAuthenticated,mealPlanController.showShoppingList);
router.get("/weeklyPlanner", authMiddleware.isAuthenticated,mealPlanController.showWeeklyPlanner);
router.get("/", (req, res) => {
    res.render("index");
});
router.post("/mealPlanner", mealPlanController.saveMealPlan);

module.exports = router;