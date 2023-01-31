var express = require('express');
var router = express.Router();
const cors = require("cors");
router.use(cors());
const userRegistration = require("../controllers/userRegistration");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post("/signup" , 
userRegistration.SignUp
)
router.post("/login" , 
userRegistration.Login)

module.exports = router;
