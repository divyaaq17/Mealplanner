const dishIngredientModel = require("../models/dishIngredientModel");

exports.showpage=(req,res)=>{
    dishIngredientModel.getDishes((err,dishes) => {
        if(err){
            console.log(err);
            req.flash("error","Something went wrong!")
            return res.redirect("/dishingredients");
        }

        dishIngredientModel.getIngredients((err,ingredients) => {
            if(err){
                req.flash("error","Something went wrong.")
            return res.redirect("/dishingredients");
            }
            res.render("dishIngredients",{dishes,ingredients}) //open disIngredients.ejs and send objects dishes and ingredients.
        });


    });
}

exports.saveDishIngredients = (req,res)=> {
    //
     const dishId= req.body.dishId;
     const ingredientIds = req.body.ingredientId;
     const quantities = req.body.quantity;
     let completed =0;
      
     for(let i=0;i<ingredientIds.length;i++)
     {

     dishIngredientModel.addDishIngredient(dishId,ingredientIds[i],quantities[i],
        (err) => {
            if(err){
                req.flash("error","Something went wrong.")
            return res.redirect("/dishingredients");
            }
            completed++;
            if(completed === ingredientIds.length)
            {
            req.flash("success", "Ingredients added successfully.");
            return res.redirect("/dishes/" + dishId);
            }
        }
     );
    }
}

