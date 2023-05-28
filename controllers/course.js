const courseModel = require("../models/courseModel");
const moduleModel = require("../models/moduleModel");
const userModel = require("../models/userModel");
const instructorModel = require("../models/instructorModel");
const fileHandlers = require("./fileUpload");
const addCourse = async(req, res, next) => {
  try{
  let courseDetails = req.body.course;
  console.log(req.body);
  const instructorId = req.user.objectId;
  courseDetails = JSON.parse(courseDetails);
  const courseImage = req.files.courseImg[0];
  fileHandlers
    .imageUpload(courseImage)
    .then((response) => {
      console.log(response.secure_url);
      let obj = {
        ...courseDetails,
        instructor: req.user.objectId,
        courseImg: response.secure_url,
      };
      const toSave = new courseModel(obj);
      toSave
        .save()
        .then((response) => {
          const course = response;
          instructorModel.findById(instructorId).then((response) => {
            response.course = response.course?[...response.course, course._id]:[course._id];
            response.save().then((response) => {
          res.json(course._id);
            })
        })
        })
        .catch((err) => {
          console.log(err);
          res.json();
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Invalid course details" });
    });
  }
  catch(err){
    console.log(err);
    res.status(500).send({msg:"Internal Server Error"});
  }
};
const viewCourse = (req, res, next) => {
  console.log(req.body);
  courseModel
    .findOne()
    .where("_id")
    .equals(req.body.courseId)
    // .select({reviews:0})
    // .populate('modules','title')
    // .populate('instructor','insName')
    .then((response) => {
      // console.log(response.modules);
      if (response.modules) {
        console.log("hi")
        response.populate([{path:'modules' , select:'title'} , {path:'instructor' , select:'insName'} , {path:'reviews', populate:{path:'user',select:['userName','profileImg']}}])
        // .populate('instructor' , 'insName')
        .then((response) => {
          const ratings = response.rating;
          console.log(ratings);
          response.ratings = ratings;
          const toReturn = response.toJSON();
          toReturn.rating = ratings;
          res.json({course:toReturn});
        });
      } else {
        console.log(response);
        res.json(response);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Invalid course details" });
    });
};
const addLesson = (req, res, next) => {
  let lesson = req.body.lesson;
  lesson = JSON.parse(lesson);
  const pdfFile = req.files.pdfFile[0];
  const videoFile = req.files.videoFile[0];
  fileHandlers.pdfUpload(pdfFile).then((response) => {
    let pdfUrl = response.secure_url;
    console.log(`Pdf at ${response.secure_url}`);
    fileHandlers.videoUpload(videoFile).then((response) => {
      let videoUrl = response.secure_url;
      console.log(`Video at ${response.secure_url}`);
      const moduleObj = { ...lesson, pdfUrl: pdfUrl, videoUrl: videoUrl };
      const toSave = moduleModel(moduleObj);
      toSave.save().then((response) => {
        let lessonId = response._id;
        let courseId = req.body.courseId;
        // courseId = JSON.parse(courseId);
        console.log(courseId);
        courseModel
          .findOne()
          .where("_id")
          .equals(courseId)
          .then((response) => {
            console.log(response);
            response.modules = response.modules
              ? [...response.modules, lessonId]
              : [lessonId];
            response.save().then((fresponse) => {
              res.status(200).json(lessonId);
            });
          });
        // res.json(response);
      });
    });
  });
};
const userEnrollCourse = async (req, res, next) => {
  const userId = req.user.objectId; //after auth
  console.log(req.user);
  const courseId = req.body.courseId;
  courseModel
    .findOne()
    .where("_id")
    .equals(courseId)
    .then((response) => {
      console.log("course");
      console.log(response);
      response.numberOfEnrollments = response.numberOfEnrollments
        ? response.numberOfEnrollments + 1
        : 1;
      response.save().then((response) => {
        const course = response;
        userModel
          .findOne()
          .where("_id")
          .equals(userId)
          .then((response) => {
            console.log("user");
            console.log(response);
            response.coursesEnrolled = response.coursesEnrolled
              ? [...response.coursesEnrolled, courseId]
              : [courseId];
            const numberOfModules = course.modules.length;
            const temp = new Array(numberOfModules);
            for (let i = 0; i < numberOfModules; i++) {
              temp[i] = false;
            }
            response.userCourseDetails = response.userCourseDetails
              ? [
                  ...response.userCourseDetails,
                  {
                    courseId: courseId,
                    details: temp,
                  },
                ]
              : [
                  {
                    courseId: courseId,
                    details: temp,
                  },
                ];
            console.log("Details");
            console.log(response.userCourseDetails);
            response.save().then(() => {
              res.status(200).json({courseDetails:temp});
            });
          });
      });
    });
};
const getEnrolledCourses = (req, res, next) => {
  const userId = req.user.objectId;
  userModel
    .findById(userId)
    .select("coursesEnrolled")
    .populate("coursesEnrolled")
    .then((response) => {
      console.log(response);
      res.json(response);
    });
};
const getReviews = (req, res, next) => {
  const userId = req.user.objectId;
  const { courseId, rating, comment } = req.body;
  userModel
    .findById(userId)
    .select("coursesEnrolled")
    .then((response) => {
      const temp = response.coursesEnrolled;
      let reqCourse = temp.filter((ele) => ele == courseId);
      console.log(response);
      if (reqCourse.length == 0) {
        res
          .status(403)
          .json({ msg: "You must buy the course to give a review" });   
      }
      else {
      courseModel
        .findById(courseId)
        .select("reviews")
        .then((response) => {
          const obj = {
            user: userId,
            rating: rating,
            comment: comment,
          };
          response.reviews = response.reviews
            ? [...response.reviews, obj]
            : [obj];
          response.save().then((response) => {
            res.json({ msg: "Thanks for you valuable feedback" });
          });
        });
    }
    });
};
const getAllCourses = (req, res, next) => {
  courseModel.find().populate('modules','name').limit(30).then((response) => {
    res.json(response);
  });
}
const getCourseReviews = (req , res , next) => {
  const courseId = req.params.courseId;
  courseModel.findById(courseId).select('reviews').populate('reviews.user' , 'name').then((response) => {
    console.log(response);
    res.json(response);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  })

}
const getByCategory = (req , res , next) => {
  const category = req.params.category;
  courseModel.find().where('category').equals(category).then((response) => {
    const rating = response.rating;
    let toSend = response.toJSON();
    toSend[rating] = rating;
    res.json(toSend);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  })
}
const getNavOptions = (req , res , next) => {
  courseModel.find().select('courseTitle').then((response) => {
    res.json(response);
  }).catch((err) => {
    console.log(err);
  })
};
module.exports = {
  addCourse,
  viewCourse,
  addLesson,
  userEnrollCourse,
  getEnrolledCourses,
  getReviews,//to post user reviews
  getAllCourses,
  getCourseReviews,
  getByCategory,
  getNavOptions
};
