const instructorModel = require("../models/instructorModel");
const userModel = require("../models/userModel");
const fileHandlers = require("./fileUpload");
const instructorController = require("./instructor");
const addUser = (req, res, next) => {
  let obj = req.body.user;
  obj = JSON.parse(obj);
  console.log(obj);
  let imageFile = req.files.profileImg[0];
  console.log(req.body);
  console.log(req.files.profileImg[0]);
  fileHandlers
    .imageUpload(imageFile)
    .then((response) => {
      const temp = { ...obj, profileImg: response.secure_url };
      const toSave = new userModel(temp);
      toSave
        .save()
        .then((response) => {
          console.log("User stored successfully");
          console.log(response);
          req.user = { userName: response.userName, objectId: response._id };
          next();
        })
        .catch((saveErr) => {
          console.log(saveErr);
          res.status(403).json({ msg: "Email already registered" });
        });
    })
    .catch((imgError) => {
      console.log(imgError);
    });
};
const getUser = (req, res, next) => {
  const userId = req.user.objectId;
  console.log(req.user);
  userModel
    .findOne()
    .where("_id")
    .equals(userId)
    .select({password:0})
.populate('coursesEnrolled').
    populate({
        path:'coursesEnrolled',
        populate:{
            path:'instructor',
            select:'insName',
            model:'instructor'  
        }
        // populate:'instructor',
        // model:"instructor"
    }).
    then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("Data retrieval error");
    });
};
const loginUser = (req, res, next) => {
  let obj = req.body.user;
  console.log(req);
  obj = JSON.parse(obj);
  userModel
    .findOne()
    .where("userEmail")
    .equals(obj.userEmail)
    .where("password")
    .equals(obj.password)
    .then((response) => {
      console.log("Valid login details");
      req.user = { userName: response.userName, objectId: response._id };
      next();
    })
    .catch((err) => {
      console.log("Invalid login credentials");
      res.status(403).json({ msg: "Invalid login credentials" });
    });
};
const getUserCompletion = (req , res , next) => {
    const {courseId} = req.body;
    console.log('hrere');
    console.log(req.body);
    const userId = req.user.objectId;
    userModel.findById(userId).select('userCourseDetails').then((response) => {
        const userCourseDetails = response.userCourseDetails;
        let reqDetails=null;
        userCourseDetails.forEach((ele) => {
            if (ele.courseId == courseId) {
                reqDetails = ele.details;
            }
        })
        if(!reqDetails){
          res.status(402).json({ msg: "Have not been enrolled in the course" });
        }
        else{
        res.json({completionDetails: reqDetails});
        }
    }).catch((err) => {
      res.status(403).json({ msg: "Error in fetching user details" });
    })
}
const getUserCourses = (req , res , next) => {
    const userId = req.user.objectId;
    console.log("hi");
    userModel.findById(userId).select('coursesEnrolled').populate('coursesEnrolled').
    populate({
        path:'coursesEnrolled',
        populate:{
            path:'instructor',
            select:'insName',
            model:'instructor'  
        }
        // populate:'instructor',
        // model:"instructor"
    }).
      then((response) => {
      console.log(response);
      // response.coursesEnrolled.populate('instructor').then((response) => {
        // console.log("Populated");
        // console.log(response);
        res.status(200).json({courses: response});
    })
// })
}

const getUserStatus = async(req , res , next) => {
    const userId = req.user.objectId;
    const user = await userModel.findById(userId);
    const instructor = await instructorModel.findById(userId);
    if ( user != null) {
      getUser(req , res , next);
    }
    else if ( instructor != null) {
      instructorController.getInstructor(req,res,next);
    }
  }
module.exports = {
  addUser,
  getUser,
  loginUser,
  getUserCompletion,
  getUserCourses,
  getUserStatus
};
