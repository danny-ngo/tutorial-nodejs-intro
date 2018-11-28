exports.isAuthenticated = (req, res, next) => {
    if (req.user !== undefined && req.user !== null) {
        return next();
    } else {
        res.redirect("/login");
    }
};
