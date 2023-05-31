const courseModel = require("../models/courseModel");
const moduleModel = require("../models/moduleModel");
const userModel = require("../models/userModel");
const instructorModel = require("../models/instructorModel");
const fileHandlers = require("./fileUpload");
const addCourse = async (req, res, next) => {
  try {
    let courseDetails = req.body.course;
    console.log(req.body);
    const instructorId = req.user.objectId;
    //check if valid instructor
    const instructor = await instructorModel.findById(instructorId);
    if (!instructor) {
      res.status(400).send({ msg: "Invalid instructor" });
      return;
    }
    //check if course name exists for the same instructor
    const alreadyExist = await courseModel
      .findOne()
      .where("instructor")
      .equals(instructorId)
      .where("courseTitle")
      .equals(courseDetails.courseTitle);
    if (alreadyExist) {
      res.status(400).send({ msg: "Course already exists" });
      return;
    }

    const courseImage = req.files.courseImg[0];
    const imgSaveResponse = await fileHandlers.imageUpload(courseImage);
    let obj = {
      ...courseDetails,
      instructor: req.user.objectId,
      courseImg: imgSaveResponse.secure_url,
    };
    const toSave = new courseModel(obj);
    const newCourse = await toSave.save();
    const course = newCourse;

    instructor.course = instructor.course
      ? [...instructor.course, course._id]
      : [course._id];
    await instructor.save();
    res.send({ courseId: course._id });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const viewCourse = async (req, res, next) => {
  try {
    const courseId = req.body.courseId;
    const course = await courseModel.findById(courseId);
    if (course.modules) {
      const populated = await course.populate([
        { path: "modules", select: "title" },
        { path: "instructor", select: "insName" },
        {
          path: "reviews",
          populate: { path: "user", select: ["userName", "profileImg"] },
        },
      ]);
      res.json({ course: populated.toJSON() });
    } else {
      const populated = await course.populate([
        { path: instructor, select: "insName" },
        {
          path: reviews,
          populate: { path: user, select: ["userName", "profileImg"] },
        },
      ]);
      res.json({ course: populated.toJSON() });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const addLesson = async (req, res, next) => {
  try {
    const instructorId = req.user.objectId;
    const courseId = req.body.courseId;
    const module = req.body.module;
    const course = await courseModel
      .findOne()
      .where("_id")
      .equals(courseId)
      .where("instructor")
      .equals(instructorId);
    if (!course) {
      res.status(400).json({ msg: "Invalid course" });
      return;
    }
   const toSave = moduleModel(module);
    const newModule = await toSave.save();
    course.modules = course.modules
      ? [...course.modules, newModule._id]
      : [newModule._id];
    await course.save();
    res.send({ lessonId: newModule._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const userEnrollCourse = async (req, res, next) => {
  try {
    const userId = req.user.objectId; //after auth
    const courseId = req.body.courseId;
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(400).send({ msg: "Invalid user" });
      return;
    }
    const course = await courseModel.findById(courseId);
    if (!course) {
      res.status(400).send({ msg: "Invalid course" });
      return;
    }
    course.numberOfEnrollments = course.numberOfEnrollments
      ? course.numberOfEnrollments + 1
      : 1;
    user.coursesEnrolled = user.coursesEnrolled
      ? [...user.coursesEnrolled, courseId]
      : [courseId];
    const temp = new Array(course.modules.length);
    for (let i = 0; i < course.modules.length; i++) {
      temp[i] = false;
    }
    user.userCourseDetails = user.userCourseDetails
      ? [
          ...user.userCourseDetails,
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
    await course.save();
    await user.save();
    res.status(200).json({ courseDetails: temp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
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
const getReviews = async(req, res, next) => {
  try{
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
      } else {
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
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"Internal Server Error"});
    }
};
const getAllCourses = (req, res, next) => {
  courseModel
    .find()
    .populate("modules", "name")
    .limit(30)
    .then((response) => {
      res.json(response);
    });
};
const getCourseReviews = (req, res, next) => {
  const courseId = req.params.courseId;
  courseModel
    .findById(courseId)
    .select("reviews")
    .populate("reviews.user", "name")
    .then((response) => {
      console.log(response);
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};
const getByCategory = (req, res, next) => {
  const category = req.params.category;
  courseModel
    .find()
    .where("category")
    .equals(category)
    .then((response) => {
      const rating = response.rating;
      let toSend = response.toJSON();
      toSend[rating] = rating;
      res.json(toSend);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};
const getNavOptions = (req, res, next) => {
  courseModel
    .find()
    .select("courseTitle")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = {
  addCourse,
  viewCourse,
  addLesson,
  userEnrollCourse,
  getEnrolledCourses,
  getReviews, //to post user reviews
  getAllCourses,
  getCourseReviews,
  getByCategory,
  getNavOptions,
};
