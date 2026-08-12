const dishModel = require("../models/dishModel");
const ingredientModel = require("../models/ingredientModel");
const dishIngredientModel = require("../models/dishIngredientModel");

exports.showDishes = (req, res) => {

    const search = req.query.search || "";

    const page = parseInt(req.query.page) || 1;

    const limit = 5;

    const offset = (page - 1) * limit;

    dishModel.getDishCount(search, (err, countResult) => {

        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("/dishes");
        }

        const totalRows = countResult[0].total;

        const totalPages = Math.ceil(totalRows / limit);

        dishModel.getAllDishes(search, limit, offset, (err, results) => {

            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                return res.redirect("/dishes");
            }

            res.render("dishes", {

                dishes: results,

                search,

                currentPage: page,

                totalPages

            });

        });

    });

};
exports.addDish = (req, res) => {

    const dishName = req.body.dishName;

    const recipe = req.body.recipe;

    dishModel.addDish(
        dishName,
        recipe,
        (err) => {

           if (err) {

             console.log(err);

            if (err.code === "ER_DUP_ENTRY") {
                req.flash("error", "Dish already exists.");
                }
            else{
                 req.flash("error", "Something went wrong.");
             }

         return res.redirect("/dishes");
        }
            req.flash("success", "Dish added successfully.");
            return res.redirect("/dishes");
        }
    );
};

exports.showDishDetails = (req,res) => {

    const dishId = req.params.id;

    dishModel.getDishById(dishId,(err, dishResult) => {

            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                return res.redirect("/dishes");
            }

            dishIngredientModel.getIngredientsByDishId(dishId,(err,ingredientResult) => {

                    if (err) {
                        console.log(err);
                        req.flash("error", "Something went wrong.");
                        return res.redirect("/dishes");
                    }

                    res.render("dishDetails",
                        {
                            dish:dishResult[0], ingredients:ingredientResult
                        }
                    );

                }
            );

        }
    );

};
exports.addIngredientToDish = (req, res) => {

    const dishId = req.params.id;

    const ingredientId = req.body.ingredientId;

    const quantity = req.body.quantity;

    dishIngredientModel.addDishIngredient(

        dishId,

        ingredientId,

        quantity,

        (err) => {

            if (err) {

                console.log(err);

                req.flash("error", "Unable to add ingredient.");

                return res.redirect(`/dishes/${dishId}/editDish`);

            }

            req.flash("success", "Ingredient added successfully.");

            res.redirect(`/dishes/${dishId}/editDish`);

        }

    );

};
exports.removeIngredientFromDish = (req, res) => {

    const dishId = req.params.id;
    const ingredientId = req.params.ingredientId;

    dishIngredientModel.deleteDishIngredient(

        dishId,

        ingredientId,

        (err) => {

            if (err) {

                console.log(err);

                req.flash("error", "Unable to remove ingredient.");

                return res.redirect(`/dishes/${dishId}/editDish`);

            }

            req.flash("success", "Ingredient removed.");

            res.redirect(`/dishes/${dishId}/editDish`);

        }

    );

};
exports.showEditpage = (req, res) => {

    const dishId = req.params.id;

    dishModel.getDishById(
        dishId,
        (err, dishResult) => {

            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
            return res.redirect("/dishes");
            }

            ingredientModel.getAllIngredients("",1000,0,
            (err, ingredientsResult) => {

                    if (err) {
                        console.log(err);
                        req.flash("error", "Something went wrong.");
                        return res.redirect("/dishes");
                    }

                    dishIngredientModel.getIngredientsByDishId(
                        dishId,
                        (err, dishIngredientsResult) => {

                            if (err) {
                                console.log(err);
                                req.flash("error", "Something went wrong.");
                                return res.redirect("/dishes");
                            }

                            res.render(
                                "editDishIngredients",
                                {
                                    dish: dishResult[0],
                                    ingredients: ingredientsResult,
                                    dishIngredients: dishIngredientsResult
                                }
                            );

                        }
                    );

                }
            );

        }
    );

};
exports.saveEditedIngredients = (req, res) => {

    const { dishId, ingredientID, quantity } = req.body;

    dishIngredientModel.deleteDishIngredients(
        dishId,
        (err) => {

            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                return res.redirect("/dishes");
            }
            let completed = 0;
            for(let i=0;i<ingredientID.length;i++)
            {
               
            dishIngredientModel.addDishIngredient(
                dishId,ingredientID[i],quantity[i],
                (err) => {

                    if (err) {
                        console.log(err);
                        req.flash("error", "Error saving ingredients.");
                        return res.redirect("/dishes");
                    }
                    completed++;
                    if(completed=== ingredientID.length){
                        req.flash("success","Ingredients updated successfully.")
                    return res.redirect("/dishes/" + dishId);
                    }
                }
            );
        }
        }
    );

};
exports.showEditDish = (req, res) => {

    const dishId = req.params.id;

    dishModel.getDishById(dishId, (err, dishResult) => {

        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("/dishes");
        }

        ingredientModel.getAllIngredientsForDropdown((err, ingredientsResult) => {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                return res.redirect("/dishes");
            }

            dishIngredientModel.getIngredientsByDishId(dishId, (err, dishIngredientsResult) => {

                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong.");
                    return res.redirect("/dishes");
                }

                res.render("editDish", {

                    dish: dishResult[0],

                    ingredients: ingredientsResult,

                    dishIngredients: dishIngredientsResult

                });

            });

        });

    });

};

exports.saveEditedDish = (req, res) => {
    const dishId = req.params.id;
    const { dishName, recipe } = req.body;

    dishModel.updateDish(dishId, dishName, recipe, (err) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("/dishes/" + dishId);
        }
        req.flash("success","Dish updated successfully.")
        return res.redirect("/dishes");
    });
};

exports.toggleFavorite = (req, res) => {

    const dishId = req.params.id;

    dishModel.toggleFavorite(dishId, (err) => {

        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("/dishes");
        }

        res.json({
    success: true
        });

    });

};

exports.deleteDish = (req, res) => {
    const dishId = req.params.id;

     dishIngredientModel.deleteDishIngredients(
        dishId,
        (err) => {

            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                  return res.redirect("/dishes/" + dishId);
            }
                    
            dishModel.deleteDish(
                dishId,
                (err) => {

                    if (err) {
                        console.log(err);
                        req.flash("error", "Something went wrong.");
                        return res.redirect("/dishes");
                    }
                    req.flash("success", "Dish deleted successfully.")
                    return res.redirect("/dishes");
                    
                }
            );
        }
        
    );
};
//export is used whenever function is to be used by other files