const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    userEmail:{
        type:String,
        required:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true
    },
    profileImg:{
        type:String,
        default:"https://unsplash.com/200/200"
    },
    coursesEnrolled:[
        {type:mongoose.Schema.Types.ObjectId , ref:'course'}
    ],
    userCourseDetails:[
        {
            courseId:{
                type:mongoose.Schema.Types.ObjectId,ref:'course',
            },
            details:[Boolean]
        }
    ]
})
const userModel = mongoose.model("user",UserSchema);
module.exports = userModel;