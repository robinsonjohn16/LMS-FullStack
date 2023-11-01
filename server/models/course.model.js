import { model, Schema } from "mongoose";

const courseSchema=new Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        minLength:[8,"Title should be atleast 8 characters"],
        maxLength:[59,"Title must be less than 60 characters"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        minLength:[8,"Description should be atleast 8 characters"],
        maxLength:[200,"Description must be less than 200 characters"],
        trim:true
    },
    category:{
        type:String,
        required:[true,"Category is required"]
    },
    thumbnail:{
        public_id:{
            type:String,
            
        },
        secure_url:{
            type:String,
            
        }
    },
    lectures:[
        {
            title:String,
            description:String,
            lecture:{
                public_id:{
                    type:String,
                    
                },
                secure_url:{
                    type:String,
                    
                }
            }
        }
    ],
    numberOfLectures:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        required:true
    }
},
{
    timestamps:true  //It creates data creation time and data updation time with date in the database
});

const Course=model('Course',courseSchema)
export default Course;