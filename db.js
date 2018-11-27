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

sequelize.sync().then(res => console.log("CONNECTED")); // Connect to the database using the credentials

module.exports = { sequelize, User };
