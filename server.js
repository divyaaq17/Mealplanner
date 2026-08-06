require("./database/db")
const logger = require("./middleware/logger");
const express = require('express');
const app = express();
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes")
const flash = require("connect-flash");

app.use(express.urlencoded({extended:true}))
const session = require("express-session");

app.use(session({
    secret: "mealplannersecret",
    resave: false,
    saveUninitialized: false
}));


app.use(flash());
app.use((req, res, next) => {

    res.locals.user = req.session.user; //With res.locals, every EJS page automatically has access to user.
     res.locals.currentPath = req.path;

      // Flash Messages
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();

});

app.use("/", homeRoutes);
app.use("/", authRoutes);

app.set("view engine","ejs")

app.use(logger.logger);


const dishRoutes = require("./routes/dishroutes");
const ingredientRoutes = require("./routes/ingredientroutes");
const dishIngredientsRoutes = require("./routes/dishIngredientroutes");
const mealPlanRoutes =  require("./routes/mealPlanroutes");

app.use("/",dishRoutes) // the "/" means start searching for routes from root
app.use("/",ingredientRoutes)
app.use("/",dishIngredientsRoutes)
app.use("/",mealPlanRoutes)

app.listen(3000,()=>{
    console.log("Server running!")
})
app.use((req, res) => {

    res.status(404).render("404");

});