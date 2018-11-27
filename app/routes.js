const { User } = require("../db");
const bcrypt = require("bcrypt-nodejs");

module.exports = function(app, passport) {
    app.get("/", function(req, res) {
        res.render("login");
    });

    app.route("/signup")
        .get((req, res) => {
            res.render("signup");
        })
        .post((req, res, next) => {
            const { username, password } = req.body;
            return bcrypt.hash(password, bcrypt.genSaltSync(8), null, function(
                err,
                hashed
            ) {
                if (err) {
                    throw err;
                }
                return User.create({ username, password: hashed })
                    .then(user => {
                        res.render("index", { user });
                    })
                    .catch(e => next(e));
            });
        });

    app.post("/login", passport.authenticate("local"), (req, res, next) => {
        res.render("index", { user: req.user });
    });

    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    app.use((req, res, next) => {
        const e = new Error("Not Found");
        e.status = 404;
    });

    app.use((err, req, res, next) => {
        console.error(err);
        res.status(err.status || 500).json({ message: err.message });
    });
};
