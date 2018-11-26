const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");

const sequelize = new Sequelize(
    "tutorial",
    process.env.MYSQL_USER,
    process.env.MYSQL_PASS,
    {
        host: process.env.MYSQL_HOST,
        dialect: "mysql"
    }
);

const User = sequelize.define("user", {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});

// User.beforeCreate((user, options) => {
//     return bcrypt.hash(user.password, bcrypt.genSaltSync(8), null, function(
//         err,
//         hashed
//     ) {
//         if (err) {
//             throw err;
//         }
//         user.password = hashed;
//     });
// });

sequelize.sync().then(res => console.log("CONNECTED"));

module.exports = { sequelize, User };
