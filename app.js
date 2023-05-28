const express = require("express");
var path = require("path");
require("dotenv-flow").config();
const mongoose = require("mongoose");
const cors = require("cors");
const morganLog = require("morgan")
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(morganLog("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.disable('x-powered-by');


var usersRouter = require("./routes/userRouter");
var instructorRouter = require("./routes/instructorRouter");
const courseRouter = require('./routes/courseRoutes')
app.use("/user", usersRouter);
app.use("/instructor" ,instructorRouter );
app.use("/course" , courseRouter);

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
  next();
  // render the error page
});

mongoose.connect(
  process.env.DB_URI,
  );

app.listen((process.env.PORT) , () =>{
  console.log(`Server running in port ${process.env.PORT}`)})


module.exports = app;
