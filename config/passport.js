// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");

// load up the user model
const { User } = require("../db");

// expose this function to our app using module.exports
module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.use(
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                return User.findOne({ where: { username } })
                    .then(result => {
                        if (!result) {
                            return done(null, false);
                        }
                        const user = result.toJSON();
                        if (!bcrypt.compareSync(password, user.password)) {
                            return done(null, false);
                        }
                        return done(null, user);
                    })
                    .catch(e => {
                        return done(e);
                    });
            }
        )
    );

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
