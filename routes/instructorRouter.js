const express = require('express')
const router = express.Router();
var bodyParser = require('body-parser');
const instructor = require('../controllers/instructor');
var multer = require('multer');
var upload = multer();
const jauth = require("../middlewares/Jauth");
router.use(bodyParser.json()); 
router.use(express.static('public'));
router.use(bodyParser.urlencoded({ extended: false })); 
router.post('/add' ,upload.single('insImage'), instructor.addInstructor , jauth.signToken);
router.post('/login',upload.single('instructor'), instructor.loginInstructor,jauth.signToken);
router.get('/view' , jauth.authenticateToken, instructor.getInstructor);
module.exports = router;