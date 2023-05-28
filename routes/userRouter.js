var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
router.use(bodyParser.json());
router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

const userController = require("../controllers/users");
const jauth = require("../utils/token");
const { validate } = require("../validators/index");
const { signupChain, loginChain } = require("../validators/userValidator");

router.post(
  "/signup",
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "user", maxCount: 1 },
  ]),
  (req , res , next) => {
    req.body.user = JSON.parse(req.body.user);
    next();
  },
  validate(signupChain),
  userController.addUser,
  jauth.signToken
);

router.post(
  "/login",
  upload.single("user"),
  validate(loginChain),
  (req , res , next) => {
    req.body.user = JSON.parse(req.body.user);
    next();
  },
  userController.loginUser,
  jauth.signToken
);

router.get("/view", jauth.authenticateToken, userController.getUser);

router.post(
  "/completionDetails",
  jauth.authenticateToken,
  userController.getUserCompletion
);

router.get(
  "/coursesEnrolled",
  jauth.authenticateToken,
  userController.getUserCourses
);

router.get(
  "/userStatus",
  jauth.authenticateToken,
  userController.getUserStatus
);

module.exports = router;
