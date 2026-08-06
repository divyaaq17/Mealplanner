const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const ingredientController = require("../controllers/ingredientController");

router.get("/ingredients",authMiddleware.isAuthenticated,ingredientController.showIngredients);

router.get("/ingredients/:id/delete", ingredientController.deleteIngredient);
router.post("/ingredients",ingredientController.addIngredient);

module.exports=router;