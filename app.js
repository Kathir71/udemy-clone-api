var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const session = require("express-session");
const passport = require("./controllers/googleAuth")
var usersRouter = require("./routes/userRouter");
var indexRouter = require("./routes/index");
var testRouter = require("./routes/trial");
var instructorRouter = require("./routes/instructorRouter");
const courseRouter = require('./routes/courseRoutes')
const mongoose = require("mongoose");
const cloudinary = require('cloudinary');
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
// app.use("/test" , testRouter);
app.use("/instructor" ,instructorRouter );
app.use("/course" , courseRouter);
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
// mongoose.connect("mongodb://localhost:27017/udemy" , () => {
//   console.log("Database connected successfully");
// });
mongoose.connect(
  "mongodb://127.0.0.1:27017/mydb",
  // options,
  (err) => {
   if(err) console.log(err) 
   else console.log("mongdb is connected");
  }
);
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
//   console.log(cloudinary.config().cloud_name);
// cloudinary.uploader.upload('./sample1.jpg' , {public_id:"huikk" , folder:"/assessts",resource_type:"image"}).then((response) => {
//     console.log(response);
// }).catch(err => console.log(err))
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
