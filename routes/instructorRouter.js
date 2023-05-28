const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
var multer = require("multer");
var upload = multer();
router.use(bodyParser.json());
router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

const jauth = require("../utils/token");
const instructor = require("../controllers/instructor");
const { validate } = require("../validators/index");
const { signupChain, loginChain } = require("../validators/insValidator");
router.post(
  "/add",
  upload.fields([
    { name: "insImage", maxCount: 1 },
    { name: "instructor", maxCount: 1 },
  ]),
  (req , res , next) => {
    req.body.instructor = JSON.parse(req.body.instructor);
    next();
  },
  validate(signupChain),
  instructor.addInstructor,
  jauth.signToken
);

router.post(
  "/login",
  upload.single("instructor"),
  (req , res , next) => {
    req.body.instructor = JSON.parse(req.body.instructor);
    next();
  },
  validate(loginChain),
  instructor.loginInstructor,
  jauth.signToken
);

router.get("/view", jauth.authenticateToken, instructor.getInstructor);

module.exports = router;
