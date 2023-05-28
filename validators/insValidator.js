const { body } = require("express-validator");

const signupChain = [
  body("instructor.insEmail")
    .trim()
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Invalid Email")
    .escape(),
 body("instructor.bio.about")
    .trim()
    .notEmpty()
    .withMessage("About must not be empty")
    .escape(),
  body("instructor.bio.occupation")
    .trim()
    .notEmpty()
    .withMessage("Occupation must not be empty")
    .escape(),
  body("instructor.insPassword")
    .trim()
    .notEmpty()
    .withMessage("Password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long")
    .escape(),
  body("instructor.insName")
    .trim()
    .notEmpty()
    .withMessage("Name must not be empty")
    .escape(),
];

const loginChain = [
  body("instructor.insEmail")
    .trim()
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Invalid Email")
    .escape(),
  body("instructor.insPassword")
    .trim()
    .notEmpty()
    .withMessage("Password must not be empty")
    .escape(),
];

module.exports = {
  loginChain,
  signupChain,
};
