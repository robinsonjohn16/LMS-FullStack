import { Router } from 'express';
import { 
        getAllCourses,
        createCourse,
        getLecturesByCourseId,
        updateCourse,
        removeCourse,
        addLectureToCourseById,
        removeLectureFromCourse 
       } from '../Controllers/course.controller.js';
import { isLoggedIn,authorizedRoles,authorizedSubscriber } from '../Middlewares/auth.middleware.js';
import upload from '../Middlewares/multer.middleware.js';

const router=Router()

router.route('/')
        .get(getAllCourses)  //find all courses
        .post(
                isLoggedIn,
                authorizedRoles('ADMIN'),
                upload.single("thumbnail"),   //create course
                createCourse
              )
        
        .delete(
                isLoggedIn,
                authorizedRoles('ADMIN'),
                removeLectureFromCourse   //Operated with URL and query URL?coureId='courseId'&lectureId='lectureId'
              )

router.route('/:id')
        .get(
                isLoggedIn,
                authorizedSubscriber,  //get all lectures of a course
                getLecturesByCourseId
            )
        .put(
                isLoggedIn,
                authorizedRoles('ADMIN'),  //update course by id
                updateCourse
            )
        .delete(
                isLoggedIn,
                authorizedRoles('ADMIN'),  //delete course by id
                removeCourse
                )
        .post(
                isLoggedIn,
                authorizedRoles('ADMIN'),
                upload.single('lectureData'),  //Add lecture to a course by courseId
                addLectureToCourseById
        )



export default router;