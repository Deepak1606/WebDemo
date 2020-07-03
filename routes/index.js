var express = require("express");
var router = express.Router();
var passport = require("passport");
var jQuery = require('jquery');
var axios = require('axios');

var User = require("../models/user");
const bodyParser = require('body-parser');

//root route
router.get("/", function(req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function(req, res) {
    res.render("user/register", { page: 'register' });
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("user/register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, function(err, foundUser) {
        if (err || !foundUser) {
            console.log(err);
            req.flash('error', 'Sorry, that user does not exist!');
            return res.redirect('/campgrounds');
        }
        //render show template with that campground
        res.render("user/show", { currentUser: foundUser });
    });
})

router.put("/users/:id", function(req, res) {
    var newData = { address: req.body.address, email: req.body.email, pincode: req.body.pincode, state: req.body.state, district: req.body.district };
    User.findByIdAndUpdate(req.params.id, { $set: newData }, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/users/" + user._id);
        }
    });
});
router.get('/users/:id/edit', (req, res) => {
    res.render("user/edit");
});
//show login form
router.get("/login", function(req, res) {
    res.render("user/login", { page: 'login' });
});

//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome to YelpCamp!'
}), function(req, res) {});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "See you later!");
    res.redirect("/campgrounds");
});


module.exports = router;