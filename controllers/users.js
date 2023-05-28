const instructorModel = require("../models/instructorModel");
const userModel = require("../models/userModel");
const fileHandlers = require("./fileUpload");
const instructorController = require("./instructor");
const addUser = async (req, res, next) => {
  try {
    let obj = req.body.user;
    const alreadyExist = await userModel
      .findOne()
      .where("userEmail")
      .equals(obj.userEmail);
    if (alreadyExist) {
      res.status(403).json({ msg: "Email already registered" });
    } else {
      let imageFile = req.files.profileImg[0];
      const response = await fileHandlers.imageUpload(imageFile);
      const temp = { ...obj, profileImg: response.secure_url };
      const toSave = new userModel(temp);
      const saveResponse = await toSave.save();
      req.user = {
        userName: saveResponse.userName,
        objectId: saveResponse._id,
      };
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.objectId;
    const response = await userModel
      .findOne()
      .where("_id")
      .equals(userId)
      .select({ password: 0 })
      .populate("coursesEnrolled")
      .populate({
        path: "coursesEnrolled",
        populate: {
          path: "instructor",
          select: "insName",
          model: "instructor",
        },
      });
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const loginUser = async (req, res, next) => {
  try {
    let obj = req.body.user;
    const user = await userModel
      .findOne()
      .where("userEmail")
      .equals(obj.userEmail)
      .where("password")
      .equals(obj.password);
    if (user) {
      console.log("Valid login details");
      req.user = { userName: user.userName, objectId: user._id };
      next();
    } else {
      console.log("Invalid login credentials");
      res.status(403).json({ msg: "Invalid login credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const getUserCompletion = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    console.log(req.body);
    const userId = req.user.objectId;
    const response = await userModel
      .findById(userId)
      .select("userCourseDetails");
    const userCourseDetails = response.userCourseDetails;
    let reqDetails = null;
    userCourseDetails.forEach((ele) => {
      if (ele.courseId == courseId) {
        reqDetails = ele.details;
      }
    });
    if (!reqDetails) {
      res.status(402).json({ msg: "Have not been enrolled in the course" });
    } else {
      res.json({ completionDetails: reqDetails });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const getUserCourses = async (req, res, next) => {
  try {
    const userId = req.user.objectId;
    const response = await userModel
      .findById(userId)
      .select("coursesEnrolled")
      .populate("coursesEnrolled")
      .populate({
        path: "coursesEnrolled",
        populate: {
          path: "instructor",
          select: "insName",
          model: "instructor",
        },
      });
    res.status(200).json({ courses: response });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const getUserStatus = async (req, res, next) => {
  try {
    const userId = req.user.objectId;
    const user = await userModel.findById(userId);
    const instructor = await instructorModel.findById(userId);
    if (user != null) {
      getUser(req, res, next);
    } else if (instructor != null) {
      instructorController.getInstructor(req, res, next);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};
module.exports = {
  addUser,
  getUser,
  loginUser,
  getUserCompletion,
  getUserCourses,
  getUserStatus,
};
