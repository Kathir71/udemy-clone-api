var express = require('express');
var router = express.Router();
const session = require("express-session");
const passport = require("../controllers/googleAuth")
const UserModel = require("../models/userModel");
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.get("/auth/google" , 
   passport.authenticate("google", { scope: ["profile","email"] }),

);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  function (req, res) {
    // Successful authentication, redirect secrets.
    console.log("H3ll");
    console.log(req);
    res.redirect("http://localhost:3000");  
  }
);
router.get("/fuck" , (req , res) => {
  res.json({name:'hello'});
})


module.exports = router;
