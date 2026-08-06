const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const controller = require("../controllers/dishIngredientController")

router.post("/dish-ingredients",controller.saveDishIngredients);


router.get("/dish-ingredients",authMiddleware.isAuthenticated, controller.showpage);

module.exports = router;