const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
const instructorModel = require("../models/instructorModel");
router.use(bodyParser.json());
router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

const userController = require("../controllers/users");
const jauth = require("../utils/token");
const validators = require("../validators/courseValidator");
const { validate } = require("../validators/index");
const coursesController = require("../controllers/course");
const moduleController = require("../controllers/module");
router.post(
  "/add",
  jauth.authenticateToken,
  (req, res, next) => {
    instructorModel
      .findOne()
      .where("_id")
      .equals(req.user.objectId)
      .then((response) => {
        console.log(response);
        next();
      })
      .catch((err) => {
        res.status(407).json({ msg: "Invalid instructor" });
      });
  },
  upload.fields([
    { name: "courseImg", maxCount: 1 },
    { name: "course", maxCount: 1 },
  ]),
  (req, res, next) => {
    req.body.course = JSON.parse(req.body.course);
    next();
  },
  validate(validators.addCourseValidator),
  coursesController.addCourse
);

router.post(
  "/view",
  validate(validators.courseViewValidator),
  coursesController.viewCourse
);

router.post(
  "/addLesson",
  jauth.authenticateToken,
 validate(validators.addModuleValidator),
  (req, res, next) => {
    instructorModel
      .findOne()
      .where("_id")
      .equals(req.user.objectId)
      .then((response) => {
        console.log(response);
        next();
      })
      .catch((err) => {
        res.status(407).json({ msg: "Invalid instructor" });
      });
  },
  coursesController.addLesson
);

router.post(
  "/enrollCourse",
  jauth.authenticateToken,
  validate(validators.enrollCourseValidator),
  coursesController.userEnrollCourse
);

router.get(
  "/getLesson/:courseId/:lessonId",
  jauth.authenticateToken,
  moduleController.getLesson
);

router.post(
  "/markcompleted",
  jauth.authenticateToken,
  validate(validators.markCompletedValidator),
  moduleController.markCompleted
);

router.get(
  "/enrolledCourses",
  jauth.authenticateToken,
  coursesController.getEnrolledCourses
);

router.post("/review", jauth.authenticateToken, coursesController.getReviews);

router.get("/all", coursesController.getAllCourses);

router.post("/courseReviews/:courseId", coursesController.getCourseReviews);

router.get("/category/:category", coursesController.getByCategory);

router.get("/navOptions", coursesController.getNavOptions);

module.exports = router;
