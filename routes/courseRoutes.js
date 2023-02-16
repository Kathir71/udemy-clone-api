const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const instructorModel = require('../models/instructorModel');
router.use(bodyParser.json()); 
router.use(express.static('public'));
router.use(bodyParser.urlencoded({ extended: false })); 
const userController = require("../controllers/users");
const jauth = require("../middlewares/Jauth");
const coursesController = require("../controllers/course");
const moduleController = require("../controllers/module");
router.post("/add" , jauth.authenticateToken , (req , res , next) => {
    instructorModel.findOne().where('_id').equals(req.user.objectId).then((response) => {
        console.log(response);
        next();
    }).catch((err) => {
        res.status(407).json({msg:"Invalid instructor"});
    })
} , upload.fields([{name:'courseImg' , maxCount:1} , {name:'course' , maxCount:1}]) , coursesController.addCourse);


router.post("/view" , coursesController.viewCourse);


router.post("/addLesson" , jauth.authenticateToken , 
 upload.fields([{name:'pdfFile' , maxCount:1} , {name:'videoFile' , maxCount:1} , {name:'lesson' , maxCount:1}]), (req , res , next) => {
    instructorModel.findOne().where('_id').equals(req.user.objectId).then((response) => {
        console.log(response);
        next();
    }).catch((err) => {
        res.status(407).json({msg:"Invalid instructor"});
    })
} , coursesController.addLesson);

router.post("/enrollCourse" , jauth.authenticateToken , coursesController.userEnrollCourse);

router.get("/getLesson/:courseId/:lessonId" ,jauth.authenticateToken , moduleController.getLesson );//handle two scenarios ig fuck

router.post("/markcompleted" , jauth.authenticateToken , moduleController.markCompleted);

router.get("/enrolledCourses" , jauth.authenticateToken , coursesController.getEnrolledCourses);

router.post("/review" , jauth.authenticateToken , coursesController.getReviews);

router.get("/all" , coursesController.getAllCourses);    

router.post("/courseReviews/:courseId" , coursesController.getCourseReviews);

router.get("/category/:category" , coursesController.getByCategory);

router.get("/navOptions" , coursesController.getNavOptions);
module.exports = router;
