const { query, validationResult, body } = require("express-validator");
const signupChain = [
    body("user.userEmail")
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Invalid Email")
    .escape(),

    body("user.password")
    .notEmpty()
    .withMessage("Password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long")
    .escape(),
    
    body("user.userName")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .escape(),

];
const loginChain = [
    body("user.userEmail")
    .trim()
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Invalid Email")
    .escape(),
    body("user.password")
    .trim()
    .notEmpty()
    .withMessage("Password must not be empty")
    .escape(),
]
module.exports = {
  signupChain,
  loginChain,
};
