const instructorModel = require("../models/instructorModel");
const fileHandlers = require("./fileUpload");
const addInstructor = (req, res, next) => {
  console.log(req.files);
  let obj = req.body.instructor;
  obj = JSON.parse(obj);
  let imageFile = req.files.insImage[0];
  fileHandlers.imageUpload(imageFile).then((response) => {
    const temp = { ...obj, imgUrl: response.secure_url };
    const toSave = new instructorModel(temp);
    toSave.save().then((response) => {
      console.log("Instructor stored successfully");
      console.log(response);
      req.user = {userName:response.insName , objectId:response._id};
    next();
    })
    .catch((saveErr) => {
        console.log(saveErr);
    })
  }).catch((imgError) => {
    console.log(imgError);
  })
};
const loginInstructor = (req , res ,next) => {
    let obj = req.body.instructor;
    console.log(req);
    console.log(req.body);
    obj = JSON.parse(obj);
    instructorModel.findOne().where('insEmail').equals(obj.insEmail).where('insPassword').equals(obj.insPassword).then((response) => {
        console.log("Valid login details");
        req.user = {userName:response.insName , objectId:response._id};
        next();
    }).catch((err) => {
        console.log("Invalid credentials");
        res.status(403).json({msg:"Invalid credentials"});
    })
}
const getInstructor = (req , res , next) => {
    const insId = req.user.objectId;
    console.log(req.user);
    instructorModel.find().where("_id").equals(insId).then((response) => {
        res.json(response);
    }).catch((err) => {
        console.log("Data retrieval error");
    })
}
module.exports = {
    addInstructor,
    loginInstructor,
    getInstructor
}
