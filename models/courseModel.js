const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    language:{
        type:String
    },
    keypoints:{
        type:[String]
    },
    updatedDate:{
        type:Date,
        default:Date.now
    },
    cost:{
        type:Number,
        min:0
    },
    courseImg:{
        type:String,
        default:"https://unsplash.com/200/200"
    },
    modules:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:'module'
        }
    ],
    category:{
        type:String,
        enum:['DataScience','Python','Java','Machine Learning','Web development']
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'instructor'
    },
    numberOfEnrollments:{
        type:Number,
        min:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            rating:{
                type:Number,
            },
            comment:{
                type:String,
                trim:true
            }
        }
    ]
})
courseSchema.virtual('rating').get(
    function() {
        let sum = 0;
        this.reviews.map((ele) => sum += ele.rating);
        sum /= this.reviews.length;
        return sum;
    }
)
const courseModel = mongoose.model('course',courseSchema);
module.exports = courseModel;