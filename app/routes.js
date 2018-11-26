const { User } = require("../db");
const bcrypt = require("bcrypt-nodejs");

module.exports = function(app, passport) {
    app.get("/", function(req, res) {
        res.render("login");
    });

    app.post("/users", (req, res, next) => {
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
                    res.json({ success: true, user });
                })
                .catch(e => next(e));
        });
    });

    app.post("/login", passport.authenticate("local"), (req, res, next) => {
        res.json({ user: req.user });
    });

    app.get("/signup", function(req, res) {
        res.render("signup");
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
