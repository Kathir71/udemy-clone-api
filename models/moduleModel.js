const mongoose = require("mongoose");
const moduleSchema = new mongoose.Schema({
    tile:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    videoUrl:{
        type:String,
        required:true
    },
    pdfUrl:{
        type:String,
        required:true
    }
}
);
const moduleModel = mongoose.model('module',moduleSchema);
module.exports = moduleModel;