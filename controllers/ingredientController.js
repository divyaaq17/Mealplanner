const ingredientModel = require("../models/ingredientModel");
const dishIngredientModel = require("../models/dishIngredientModel")

exports.showIngredients = (req, res) => {

    const search = req.query.search || "";

    const page = parseInt(req.query.page) || 1;

    const limit = 10;

    const offset = (page - 1) * limit;

    ingredientModel.getIngredientCount(search, (err, countResult) => {

        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("/ingredients");
        }

        const totalRows = countResult[0].total;

        const totalPages = Math.ceil(totalRows / limit);

        ingredientModel.getAllIngredients(search, limit, offset, (err, results) => {

            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                return res.redirect("/ingredients");
            }

            res.render("ingredients", {

                ingredients: results,

                search,

                currentPage: page,

                totalPages

            });

        });

    });

};

exports.addIngredient = (req,res) => {
    const ingredientName = req.body.ingredientName;
    ingredientModel.addIngredient(ingredientName,  //adding the parameters to addIngredients(ingredientname,callback)
        (err)=>{
            if (err) {

                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                      req.flash("error", "Ingredient already exists.");
                } else {
                      req.flash("error", "Something went wrong.");
                }

                return res.redirect("/ingredients");
            }
            req.flash("success","Ingredient added successfully.")
            return res.redirect("/ingredients");
        }
    );
};

exports.deleteIngredient = (req,res) => {
    const id = req.params.id;
     
    dishIngredientModel.checkIngredientUsage(id,
        (err,results)=>{
            if(err){
                console.log(err);
                req.flash("error","Something went wrong.")
            return res.redirect("/ingredients");
            }
            if(results.length > 0)
            {
                req.flash("error","Ingredient is being used in one or more dishes.")
                return res.redirect("/ingredients")
            }
            ingredientModel.deleteIngredient(id,
                (err,result)=>{
                    if(err){
                    console.log(err);
                      req.flash("error","Something went wrong.")
                     return res.redirect("/ingredients");
                     }
                     req.flash("success","Ingredient deleted successfully.")
                     return res.redirect("/ingredients");
                }
                
            );
        }
    );
    
}