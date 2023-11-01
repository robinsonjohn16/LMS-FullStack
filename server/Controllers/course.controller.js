import Course from "../models/course.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'

///////////////GET ALL COURSES////////////////////////////
const getAllCourses=async function(req,res,next){
   try {
      const courses=await Course.find({}).select('-lectures');
      if(!courses)
      {
         return next(
            new AppError("No course available",403)
         )
      }
      res.status(200).json({
        Success:true,
        message:"Available All Courses",
        courses
      })
   } catch (error) {
    return next(
        new AppError(error.message,500)
     )
   }
}

/////////////////////////////////GET LECTURE BY COURSEID/////////////////////
const getLecturesByCourseId=async function(req,res,next){
   try {
       const {id}=req.params;
        
      const course=await Course.findById(id)
      
      if(!course)
      {
         return next(
            new AppError("No Lectures available",403)
         )
      }
      res.status(200).json({
        Success:true,
        message:"Course Lectures fetched successfully",
        lectures:course.lectures
      })
   } catch (error) {
    return next(
        new AppError(error.message,500)
     )
   }
}

//////////////////////////////////////CREATE COURSE///////////////////////////////////
const createCourse=async function(req,res,next){
  try {
        const {title, description, category, createdBy}=req.body;
        console.log(title,description,category,createdBy)
        if(!title || !description || !category || !createdBy)
        {
         return next(
            new AppError("All fields are required",400)
         )
        }
        const course=await Course.create({
         title,
         description,
         category,
         createdBy
        })
        if(!course)
        {
         return next(
            new AppError("course could not be created",401)
         )
        }
        if(req.file)
        {
         try {
            
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'
         })
         
         if(!result)
         {
           return next(
            new AppError('File is not uploaded to cloudinary',400)
           )
         }
           course.thumbnail.public_id=result.public_id;
           course.thumbnail.secure_url=result.secure_url;
         fs.rm(`uploads/${req.file.filename}`)
         } catch (error) {
            return next(
               new AppError(error.message,402)
            )
         }
        }
        await course.save();
        res.status(200).json({
         Success:true,
         message:'Course created successfully',
         course
        })
  } catch (error) {
   return next(
      new AppError(error.message,500)
   )
  }
}

///////////////////////////////////////////// UPDATE COURSE //////////////////////////////////
const updateCourse=async function(req,res,next){
 try {
    const { id }=req.params;
    const course=await Course.findByIdAndUpdate(
      id,
      {
         $set:req.body
      },
      {
         runValidators:true //it checks new data structure by course already defined structure(schema)
      }
    )
    if(!course)
    {
      return next(
         new AppError('Course with given id does not exist',400)
      )
    }
    res.status(200).json({
      Success:true,
      message:'Course updated successfully',
      course
    })
 } catch (error) {
   return next(
      new AppError(error.message,500)
   )
 }

}

///////////////////////////////// REMOVE COURSE //////////////////////////////////////////
const removeCourse=async function(req,res,next){
 try {
    const { id }=req.params;
    const course=await Course.findByIdAndDelete(id);
    if(!course)
    {
      return next(
         new AppError('Course with given id does not exist',400)
      )
    }
    res.status(200).json({
      Success:true,
      message:'Course deleted successfully',
      course
    })
 } catch (error) {
   return next(
      new AppError(error.message,500)
   )
 }

}

/////////////////////////////////////// ADD LECTURE BY COURSEID ///////////////////////
const addLectureToCourseById=async (req,res,next)=>{
   try {

   const { id }=req.params;
   const {title,description}=req.body;
   console.log(title,description)
   if(!title || !description)
   {
      return next(
         new AppError('title and description of lecture are required',400)
      )
   }
   const course=await Course.findById(id);
   if(!course)
   {
      return next(
         new AppError('Course with given id does not',400)
      )
   }
   const lecutreData={
      title,
      description,
      lecture:{}
   }
   
   if(req.file)
        {
         
            
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'
         })
         
         if(!result)
         {
           return next(
            new AppError('File is not uploaded to cloudinary',400)
           )
         }
           lecutreData.lecture.public_id=result.public_id;
           lecutreData.lecture.secure_url=result.secure_url;
         fs.rm(`uploads/${req.file.filename}`)
         }
         else
         {
            return next(
               new AppError('Please select file to upload..',404)
            )
         }
        
         await course.lectures.push(lecutreData);
         course.numberOfLectures=course.lectures.length;
         await course.save();
         res.status(200).json({
            Success:true,
            message:'Lecture added successfully',
            course
         })
      } catch (error) {
       return next(
         new AppError(error.message,500)
       )
      }
      }

///////////////////// REMOVE LECTURE FORM COURSE: Route (URL/:courseId/Lecture/:lectureId) //////
   const removeLectureFromCourse=async (req,res,next)=>{
      try {
         //get courseId and lectureId from request query
         const { courseId, lectureId }=req.query;
         console.log(courseId,lectureId)
         if(!courseId||!lectureId)
         {
            return next(
               new AppError('courseId and lectureId are required.',404)
            )
         }
         //find course in database by id
         const course=await Course.findById(courseId);
         if(!course)
         {
            return next(
               new AppError('course does not exist with provided id',404)
            )
         }
         //find index of lecture comparison with lectureId
         const lectureIndex=course.lectures.findIndex(
            (lecture)=>lecture._id.toString()===lectureId.toString()
         );
         if(lectureIndex===-1) //if above code is representing '-1' index
         {
            return next(
               new AppError('Lecture does not exist',404)
            )
         }
        //delete image or video file from cloundinary of given lecture
        await cloudinary.v2.uploader.destroy(
         course.lectures[lectureIndex].lecture.public_id,{
            resource_type:'video'
         }
        )

        //Remove lecture from the array
        course.lectures.splice(lectureIndex,1)

        //update the length of the lectures in the array
        course.numberOfLectures=course.lectures.length

        //Save the course Object
        await course.save()

        //Return response
        res.status(200).json({
         Success:true,
         message:'Lecture Removed successfully'
        })
         
      } catch (error) {
         return next(
            new AppError(error.message,500)
         )
      }
   }



export{
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    removeLectureFromCourse
}