const courseModel = require("../models/courseModel");
const moduleModel = require("../models/moduleModel");
const userModel = require("../models/userModel");
const fileHandlers = require("./fileUpload");
const addCourse = (req, res, next) => {
  let courseDetails = req.body.course;
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
          res.json(response._id);
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
};
const viewCourse = (req, res, next) => {
  console.log(req);
  courseModel
    .find()
    .where("_id")
    .equals(req.body.id)
    .then((response) => {
      console.log(response.modules);
      if (response.modules) {
        response.populate("module", "title").then((response) => {
          res.json(response);
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
      const moduleObj = { ...lesson, pdfUrl: "trial", videoUrl: "trial" };
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
        res.json(response);
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
              res.status(200).json({ msg: "User enrolled successfully" });
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

module.exports = {
  addCourse,
  viewCourse,
  addLesson,
  userEnrollCourse,
  getEnrolledCourses,
  getReviews,
};
