const mealPlanModel = require("../models/mealPlanModel");
const dishModel = require("../models/dishModel");


exports.showDashboard = (req, res) => {

    mealPlanModel.getDashboardStats((err, statsResult) => {

        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("/");
        }

        const today = new Date().toLocaleDateString("en-CA");

        mealPlanModel.getTodaysMeals(today, (err, todaysMeals) => {

            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                return res.redirect("/");
            }

            mealPlanModel.getFavouriteCount((err, favouriteResult) => {

                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong.");
                    return res.redirect("/");
                }

                mealPlanModel.getMostPlannedDish((err, mostPlannedResult) => {

                    if (err) {
                        console.log(err);
                        req.flash("error", "Something went wrong.");
                        return res.redirect("/");
                    }

                    mealPlanModel.getMealsThisWeek((err, weeklyResult) => {

                        if (err) {
                            console.log(err);
                            req.flash("error", "Something went wrong.");
                            return res.redirect("/");
                        }

                        res.render("dashboard", {

                            stats: statsResult[0],

                            todaysMeals: todaysMeals,

                            favouriteCount: favouriteResult[0].favouriteCount,

                            mostPlannedDish:
                                mostPlannedResult.length > 0
                                    ? mostPlannedResult[0]
                                    : null,

                            mealsThisWeek:
                                weeklyResult[0].mealsThisWeek,

                            user: req.session.user

                        });

                    });

                });

            });

        });

    });

};