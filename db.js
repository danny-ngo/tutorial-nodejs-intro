const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");

const sequelize = new Sequelize("tutorial", "root", "qweb-nodejs", {
    host: "35.192.67.204",
    dialect: "mysql"
});

const User = sequelize.define("user", {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});

User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, bcrypt.genSaltSync(8), null, function(
        err,
        hashed
    ) {
        if (err) {
            throw err;
        }
        user.password = hashed;
    });
});

sequelize
    .sync()
    .then(() =>
        User.create({
            username: "janedoe",
            password: "asdf"
        })
    )
    .then(jane => {
        console.log(jane.toJSON());
    });
