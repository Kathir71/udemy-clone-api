const mongoose = require("mongoose");
const moduleSchema = new mongoose.Schema({
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
    }
})