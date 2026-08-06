const bcrypt = require("bcrypt");
const authModel = require("../models/authModel");

exports.showLogin = (req, res) => {

    res.render("login");

};

exports.showRegister = (req, res) => {

    res.render("register");

};

exports.registerUser = async (req, res) => {

    const { userName, email, password } = req.body;

    authModel.getUserByEmail(email, async (err, results) => {

        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("/register");
        }

        if (results.length > 0) {
            req.flash("error", "Email already registered.");
            return res.redirect("/register");
        }

        try {

            const hashedPassword = await bcrypt.hash(password, 10);

            authModel.addUser(
                userName,
                email,
                hashedPassword,
                (err) => {

                    if (err) {
                        console.log(err);
                        req.flash("error", "Something went wrong.");
                        return res.redirect("/register");
                    }

                    req.flash("success", "Registration successful.");
                    res.redirect("/login");

                });

        } catch (err) {

            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("/register");

        }

    });

};


exports.loginUser = async (req, res) => {

    const { email, password } = req.body;

    authModel.getUserByEmail(email, async (err, results) => {

        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong. Please try again.");
            return res.redirect("/login");
        }

        if (results.length === 0) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }
         try {
        const user = results[0];

        const match = await bcrypt.compare(password, user.Password);

        if (!match) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        // Login successful
        //res.send("Login Successful");
        req.session.user = {
         userId: user.UserID,
         userName: user.UserName,
         email: user.Email
        };

         req.flash("success", "Login successful");

            res.redirect("/");
        } catch (err) {

            console.log(err);
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/login");


        }
    });

};

exports.logoutUser=(req,res) => {
    req.session.destroy(err => {

    if (err) {
        console.log(err);
        return res.redirect("/");
    }

    res.clearCookie("connect.sid");

    res.redirect("/login");

});
}