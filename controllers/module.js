const moduleModel = require("../models/moduleModel");
const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const findLessonNum = async (courseId, lessonId) => {
  const course = await courseModel.findById(courseId);
  let ans = -1;
  let curr , next , prev;
  curr = next = prev = -1;
  course.modules.map((ele, idx) => {
    if (ele == lessonId) {
      curr = idx;
      ans = idx;
      prev = idx > 0 ? course.modules[idx - 1] : null;
      next = idx < course.modules.length - 1 ? course.modules[idx + 1] : null;
    }
  });
  return {prev:prev , lessonNum:curr , next:next}; //hopefully never comes to this
};
const getLesson = async (req, res, next) => {
  const lessonId = req.params.lessonId;
  const courseId = req.params.courseId;
  const userId = req.user.objectId;
  userModel.findById(userId).then(async (response) => {
    console.log("user");
    console.log(response);
    const coursesEnrolled = response.coursesEnrolled;
    const userCourseDetails = response.userCourseDetails;
    if (coursesEnrolled == null || !coursesEnrolled.includes(courseId)) {
      res.status(403).json({ msg: "Not allowed to access this course" });
    }
    else{
    const {prev,lessonNum,next} = await findLessonNum(courseId, lessonId);
    console.log(`Lesson num is ${lessonNum}`);
    const reqCourse = userCourseDetails.filter(
      (ele) => ele.courseId == courseId
    );
    console.log(reqCourse);
    const completion = reqCourse[0].details[lessonNum];
    moduleModel
      .findOne()
      .where("_id")
      .equals(lessonId)
      .then(async (response) => {
        console.log(response);
        const module = response.toJSON();
        module.prev = prev;
        module.next = next;
        module.completion = completion;
        res.json({
          module: module,
        });
      });
    }
  });
};
const markCompleted = (req , res , next) => {
    const lessonId = req.body.lessonId;
    const courseId = req.body.courseId;
    const userId= req.user.objectId;
    userModel.findById(userId).then(async(response) => {
        const user = response;
        const requiredCourse = user.userCourseDetails.filter((ele) => ele.courseId === courseId);
        let temp = user.userCourseDetails;
        const {lessonNum} = await findLessonNum(courseId, lessonId);
        temp.forEach((ele) => {
            if ( ele.courseId == courseId){
                ele.details[lessonNum] = true;
            }
        });
        user.userCourseDetails = temp;
        user.save().then((response) => {
        console.log(response);
        res.json({msg:"Marked as completed"});
        })
    })
}
module.exports = {
    getLesson,
    markCompleted
}