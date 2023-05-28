const instructorModel = require("../models/instructorModel");
const userModel = require("../models/userModel");
const fileHandlers = require("./fileUpload");

const addInstructor = async(req, res, next) => {
  try{
  let obj = req.body.instructor;
  let imageFile = req.files.insImage[0];
  const studentUser = await userModel.findOne().where('userEmail').equals(obj.insEmail);
  if (studentUser){
    res.status(403).send({msg:"Student cannot be a instructor"});
    return;
  }
  const alreadyExist = await instructorModel.findOne().where('insEmail').equals(obj.insEmail);
  if (alreadyExist){
    res.status(403).send({msg:"Email already registered"})
    return;
  }
  const imageUpload = await fileHandlers.imageUpload(imageFile)
  const temp = { ...obj, imgUrl: imageUpload.secure_url };
  const toSave = new instructorModel(temp);
  const newIns = await toSave.save()
      console.log(newIns);
      req.user = {userName:newIns.insName , objectId:newIns._id};
    next();
}
catch(err){
  console.log(err);
  res.status(500).send({msg:"Internal Server Error"});
}
};
const loginInstructor = async(req , res ,next) => {
  try{
    let obj = req.body.instructor;
    console.log(req);
    console.log(req.body);
    const ins = await instructorModel.findOne().where('insEmail').equals(obj.insEmail).where('insPassword').equals(obj.insPassword)
    if(ins){
        console.log("Valid login details");
        req.user = {userName:ins.insName , objectId:ins._id};
        next();
    }
    else{
        console.log("Invalid credentials");
        res.status(403).json({msg:"Invalid credentials"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).send({msg:"Internal Server Error"});
  }
}

const getInstructor = async(req , res , next) => {
  try{
    const insId = req.user.objectId;
    console.log(req.user);
    const ins = await instructorModel.findById(insId).select({insPassword:0}).populate('course')
      let averageRating = 0;
      let toSend = ins.toJSON();
      for ( let i = 0 ; i < ins.course.length ; i++ ) {
      console.log(ins.course[i].rating);
      averageRating += ins.course[i].rating;
      }
      toSend['userType'] = 'instructor';
      toSend['instructorRating'] = averageRating/ins.course.length;
        res.status(200).json(toSend);
  }catch(err){
      console.log(err);
      res.status(500).send({msg:"Internal Server Error"});
    }
}


module.exports = {
    addInstructor,
    loginInstructor,
    getInstructor
}
