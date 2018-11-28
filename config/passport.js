// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");

// load up the user model
const { User } = require("../db");

const hash = key => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(key, bcrypt.genSaltSync(8), null, function(err, hashed) {
            if (err) {
                reject(err);
            } else {
                resolve(hashed);
            }
        });
    });
};

// expose this function to our app using module.exports
module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.use(
        "login",
        new LocalStrategy(
            {
                // by default, local strategy uses username and password
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                return User.findOne({ where: { username } })
                    .then(result => {
                        if (!result) {
                            return done(
                                null,
                                false,
                                req.flash("loginMessage", "No User Found")
                            );
                        }
                        const user = result.toJSON();
                        if (!bcrypt.compareSync(password, user.password)) {
                            return done(
                                null,
                                false,
                                req.flash("loginMessage", "Wrong password")
                            );
                        }
                        return done(null, user);
                    })
                    .catch(e => {
                        return done(e);
                    });
            }
        )
    );

    passport.use(
        "signup",
        new LocalStrategy(
            {
                // by default, local strategy uses username and password
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                hash(password)
                    .then(hashed => {
                        return User.create({
                            username,
                            password: hashed
                        });
                    })
                    .then(user => {
                        done(null, user);
                    })
                    .catch(e => {
                        if (e.name === "SequelizeUniqueConstraintError") {
                            done(
                                null,
                                false,
                                req.flash(
                                    "signupMessage",
                                    "username already taken"
                                )
                            );
                        }
                        done(e);
                    });
            }
        )
    );

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => done(null, user))
            .catch(e => done(e));
    });
};
