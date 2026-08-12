const express = require("express"); //Import the Express package.
const router = express.Router();//Create a Router object.A Router is used to define URLs.
const authMiddleware = require("../middleware/authMiddleware");

const dishController = require("../controllers/dishController");//Load the controller file.

router.get("/dishes",authMiddleware.isAuthenticated,dishController.showDishes) //match URL and run the function
router.get("/dishes/:id/editDish",authMiddleware.isAuthenticated, dishController.showEditDish)
router.get("/dishes/:id/deleteDish",authMiddleware.isAuthenticated, dishController.deleteDish);
router.get(    "/dishes/:id/favorite",    dishController.toggleFavorite);
router.get("/dishes/:id",authMiddleware.isAuthenticated,dishController.showDishDetails);
router.get("/dishes/:id/edit",authMiddleware.isAuthenticated,dishController.showEditpage)
router.post(
    "/dishes/:id/ingredients",
    authMiddleware.isAuthenticated,
    dishController.addIngredientToDish
);
router.get(
    "/dishes/:id/ingredients/:ingredientId/delete",
    authMiddleware.isAuthenticated,
    dishController.removeIngredientFromDish
);
router.post("/dishes",dishController.addDish);
router.post("/dishes/:id/editDish" , dishController.saveEditedDish)
router.post("/dishes/:id/edit", dishController.saveEditedIngredients);



module.exports=router; // make it available to other files