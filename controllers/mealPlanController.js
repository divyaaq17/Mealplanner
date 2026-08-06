const mealPlanModel = require("../models/mealPlanModel");

exports.showMealPlanner = (req, res) => {
    const mealDate = req.query.mealDate;

    mealPlanModel.getDishes((err, dishes) => {
        console.log("Dishes from DB:", dishes);
        if (err) {
            console.log(err);
            req.flash("error","Something went wrong.")
            return res.redirect("/mealplanner");
        }

        if (!mealDate) {
            return res.render("mealPlanner", {
                dishes: dishes,
                meals: [],
                selectedMeals: {},
                mealDate: ""
            });
        }

        mealPlanModel.getMealsByDate(mealDate, (err, meals) => {

            if (err) {
                console.log(err);
                req.flash("error","Something went wrong.")
            return res.redirect("/mealplanner");
            }
            const selectedMeals = {};

            meals.forEach(meal => {
              selectedMeals[meal.mealType] = meal.DishID;
            });
          //  console.log(meals)
          //console.log(selectedMeals);
            res.render("mealPlanner", {
                dishes: dishes,
                meals: meals,
                selectedMeals: selectedMeals,
                mealDate: mealDate
            });

        });

    });
};


exports.saveMealPlan = (req,res) => {
    const {mealDate, breakfastdish, lunchdish, dinnerdish} = req.body;
    const meals = [
    {
        mealType: "Breakfast",
        dishId: breakfastdish
    },
    {
        mealType: "Lunch",
        dishId: lunchdish
    },
    {
        mealType: "Dinner",
        dishId: dinnerdish
    }
];
mealPlanModel.deleteMealsByDate(mealDate,(err) => {
    if(err){
        console.log(err);
        req.flash("error","Something went wrong.")
            return res.redirect("/mealplanner");
    }
   

let completed = 0;

for (let i = 0; i < meals.length; i++) {
    mealPlanModel.addMeal(
    mealDate,
    meals[i].mealType,
    meals[i].dishId,
    (err) => {
        if (err) {
    console.log(err);
    req.flash("error","Something went wrong.")
            return res.redirect("/mealplanner");
        }

        completed++;

        if (completed === meals.length) {
            req.flash("success","Meal plan added successfully.")
        return res.redirect("/mealPlanner?mealDate=" + mealDate);
        }
    }
);
}
})
}

exports.showShoppingList = (req,res) => {
    const mealDate = req.query.mealDate;

    mealPlanModel.getShoppingListByDate(mealDate,(err,results)=>{
        if(err){
            console.log(err);
            req.flash("error","Something went wrong.")
            return res.redirect("/shoppingList");
        }
        
        res.render("shoppingList",{
            shoppingList:results,
            mealDate:mealDate
        });
    });
};

exports.showWeeklyPlanner = (req, res) => {

    const firstMealDate = req.query.firstMealDate;
     if (!firstMealDate) {
    return res.render("weeklyPlanner", {
        weekData: {},
        firstMealDate: ""
    });
    }
   
    //console.log("Input:", firstMealDate);

// const test = new Date(firstMealDate);

// console.log("Parsed:", test);
// console.log("ISO:", test.toISOString());

   
    const parts = firstMealDate.split("-");
    const endDate = new Date(parts[0], parts[1] - 1, parts[2]);

    endDate.setDate(endDate.getDate() + 6);

    const secMealDate = endDate.toLocaleDateString("en-CA");

    mealPlanModel.getWeeklyMeals(firstMealDate, secMealDate, (err, results) => {

        if (err) {
            console.log(err);
            req.flash("error","Something went wrong.")
            return res.redirect("/weeklyPlanner");
        }

    const weekData = {};
//console.log(results);
    results.forEach(meal => {

    const dateObj = new Date(meal.mealDate);

const date = dateObj.toLocaleDateString("en-CA");

const day = dateObj.toLocaleDateString("en-US", {
    weekday: "short"
});
    if (!weekData[date]) {
        weekData[date] = {
            day:day,
            Breakfast: "",
            Lunch: "",
            Dinner: ""
        };
    }

    weekData[date][meal.mealType] = meal.dishName;
    });
        //console.log(results);
       // console.log(weekData);
        res.render("weeklyPlanner", {
            weekData: weekData,
            firstMealDate: firstMealDate,
            secMealDate: secMealDate
        });

    });

};