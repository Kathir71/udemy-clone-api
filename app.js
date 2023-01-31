var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const session = require("express-session");
const passport = require("./controllers/googleAuth")
var usersRouter = require("./routes/users");
var indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const UserModel = require("./models/userModel");
const cors = require("cors");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/udemy");
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
  next();
  // render the error page
});
app.listen((process.env.PORT) , () =>{
  console.log(`Server running in port ${process.env.PORT}`)})

// app.get("/auth/google" , 
//    passport.authenticate("google", { scope: ["profile","email"] }),

// );
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
//   function (req, res) {
//     // Successful authentication, redirect secrets.
//     console.log("H3ll");
//     console.log(req);
//     res.redirect("http://localhost:3000");  
//   }
// );
// // app.get("/logout", (req, res) => {
// //   res.redirect("http://localhost:3000/");
// // });
// app.get("/fuck" , (req , res) => {
//   res.json({name:'hello'});
// })
module.exports = app;
