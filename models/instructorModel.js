const mongoose = require("mongoose");
const instructorSchema = new mongoose.Schema({
    insName:{
        type:String,
        required:true
    },
    course:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'course'
        }]
    },
    bio:{
        occupation:String,
        about:String
    },
    imgUrl:{
        type:String,
        required:true
    },
    insEmail:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    insPassword:{
        type:String,
        required:true
    }
})
const instructorModel = mongoose.model('instructor' ,instructorSchema );
module.exports = instructorModel;