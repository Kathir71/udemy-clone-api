const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
    required:true
    },
    userEmail:{
        type:String,
        required:true,
    },
    // googleId:{
    //     type:String,
    //     required:false
    // },
    userPassword:{
        type:String
    },
    userImg:{
        type:String
    },
    // coursesEnrolled:{
    //     type:Array[mongoose.Schema.Types.ObjectId],

    // }
})
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
const userModel = mongoose.model("user",userSchema);
module.exports = userModel;