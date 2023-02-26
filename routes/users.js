const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const passport = require("passport");
const users = require("../controllers/users")

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", { failureMessage: true, failureFlash: true, keepSessionInfo: true, failureRedirect: "/login" }), users.login)

router.get("/auth/google", users.loginWithGoogle);

router.get( '/auth/google/callback',users.loginWithGoogleCallback);

router.get("/logout", users.logout);


module.exports = router;
