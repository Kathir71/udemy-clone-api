// var express = require('express');
// var bodyParser = require('body-parser');
// var multer = require('multer');
// var upload = multer();
// var router = express.Router();
// router.get('/', function(req, res){
//    res.render('form');
// });

// // for parsing routerlication/json
// router.use(bodyParser.json()); 

// // for parsing routerlication/xwww-
// router.use(bodyParser.urlencoded({ extended: true })); 
// //form-urlencoded

// // for parsing multipart/form-data
// // router.use(upload.array()); 
// // router.use(upload.none());
// router.use(express.static('public'));

// router.post('/', function(req, res){
//    console.log(req.body);
//    res.send("recieved your request!");
// });
// router.post("/registerCourse" , upload.fields([{name:'courseVideo' , maxCount:1} , { name:'courseImage' , maxCount:1}]) ,(req ,res , next) => {
//     console.log(req.files);
//     const obj = JSON.parse(req.body.file);
//     // const courseFile = req.body.courseVideo;
//     console.log(obj);
//     // console.log(courseFile);
// })
// module.exports = router;