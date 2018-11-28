const { User } = require("../db");
const bcrypt = require("bcrypt-nodejs");
const { isAuthenticated } = require("./middleware");

module.exports = function(app, passport) {
    app.get("/", isAuthenticated, (req, res, next) => {
        res.render("index", { user: req.user.toJSON() });
    });

    app.route("/signup")
        .get(function(req, res) {
            if (req.isAuthenticated()) {
                res.redirect("/");
            }
            // render the page and pass in any flash data if it exists
            res.render("signup", { message: req.flash("signupMessage") });
        })
        .post(
            passport.authenticate("signup", {
                successRedirect: "/",
                failureFlash: true,
                failureRedirect: "/signup"
            })
        );

    app.route("/login")
        .get((req, res, next) => {
            if (req.isAuthenticated()) {
                res.redirect("/");
            } else {
                res.render("login", { message: req.flash("loginMessage") });
            }
        })
        .post(
            passport.authenticate("login", {
                successRedirect: "/", // redirect to the secure profile section
                failureRedirect: "/login", // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            })
        );

    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/login");
    });

    app.use((req, res, next) => {
        const e = new Error("Not Found");
        e.status = 404;
    });

    app.use((err, req, res, next) => {
        console.error(err.name);
        res.status(err.status || 500).json({ message: err.message });
    });
};
