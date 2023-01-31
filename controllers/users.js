const instructorModel = require("../models/instructorModel");
const userModel = require("../models/userModel");
const fileHandlers = require("./fileUpload");
const addUser = (req, res, next) => {
  let obj = req.body.user;
  obj = JSON.parse(obj);
  console.log(obj);
  let imageFile = req.file;
  console.log(req.body);
  console.log(req.file);
  fileHandlers.imageUpload(imageFile).then((response) => {
    const temp = { ...obj, profileImg: response.secure_url };
    const toSave = new userModel(temp);
    toSave.save().then((response) => {
      console.log("User stored successfully");
      console.log(response);
      req.user = {userName:response.userName , objectId:response._id};
    next();
    })
    .catch((saveErr) => {
        console.log(saveErr);
        res.status(403).json({msg:"Email already registered"});
    })
  }).catch((imgError) => {
    console.log(imgError);
  })
};
const getUser = (req , res , next) => {
    const userId = req.user.objectId;
    console.log(req.user);
    userModel.find().where("_id").equals(userId).then((response) => {
        res.json(response);
    }).catch((err) => {
        console.log("Data retrieval error");
    })
}
const loginUser = (req , res ,next) => {
let obj = req;
console.log(req);
    obj = JSON.parse(obj);
    userModel.findOne().where('userEmail').equals(obj.userEmail).where('password').equals(obj.password).then((response) => {
        console.log("Valid login details");
        req.user = {userName:response.userName , objectId:response._id};
        next();
    }).catch((err) => {
        console.log("Invalid login credentials");
        res.status(403).json({msg:"Invalid login credentials"});
    })
}

module.exports = {
    addUser,
    getUser,
    loginUser
}
