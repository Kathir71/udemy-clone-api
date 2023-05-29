const { body } = require("express-validator");

const addCourseValidator = [
  body("course.courseTitle")
    .trim()
    .notEmpty()
    .withMessage("Course Title cannot be empty")
    .escape(),
  body("course.description")
    .trim()
    .notEmpty()
    .withMessage("Course description cannot be empty")
    .escape(),
  body("course.language")
    .trim()
    .notEmpty()
    .withMessage("Course language invalid")
    .escape(),
  body("course.cost")
    .isDecimal()
    .withMessage("Cost must be a decimal")
    .escape(),
  body("course.category")
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty")
    .escape(),
];

const addModuleValidator = [
  body("courseId").isMongoId().withMessage("Invalid course id").escape(),
];

const courseViewValidator = [
  body("courseId").isMongoId().withMessage("Invalid course id"),
];

const enrollCourseValidator = [
  body("courseId").isMongoId().withMessage("Invalid course id"),
];

const markCompletedValidator = [
  body("courseId").isMongoId().withMessage("Invalid course id"),
  body("lessonId").isMongoId().withMessage("Invalid lesson id"),
];

const reviewValidator = [
  body("courseId").isMongoId().withMessage("Invalid course id"),
  body("rating").isFloat({ min: 0, max: 5 }).withMessage("Invalid rating"),
  body("comment")
    .trim()
    .notEmpty()
    .isAlphanumeric()
    .withMessage("Comment cannot be empty")
    .escape(),
];

module.exports = {
  addCourseValidator,
  addModuleValidator,
  courseViewValidator,
  enrollCourseValidator,
  markCompletedValidator,
  reviewValidator,
};
