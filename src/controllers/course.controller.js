
const catchAsync = require('../utils/catchAsync')
const courseService = require('../services/course.service');
const httpStatus = require('http-status');
const  response = require('../utils/response');
const pick = require('../utils/pick');

const createCourse = catchAsync(async (req, res) => {

    const course = await courseService.createNewCourse(req);
    res.status(httpStatus.CREATED).send(response(httpStatus.CREATED, 'Create course successfully', course));
})

const updateIndex = catchAsync(async (req, res) => {

    await courseService.updateIndexCourseClick(req.body.courseId, req.user._id);
    res.status(200).send(response(200,'Success'));
});

const showNewCourse = catchAsync(async (req,res) => {
    const courseList = await courseService.showNewCourses(req.user._id,req.query.limit)
    res.status(200).send(response(200, 'Success', courseList));

});

const showRecentCourse = catchAsync(async (req, res) => {
    const options = pick(req.query, ['limit','page'])
    const recentList = await courseService.showRecentCourses(req.user._id, options);
    res.status(200).send(response(200, 'Success', recentList));

});

const deteleCourse = async (req, res) =>{
    await courseService.deleteCourseById(req);
    res.status(200).send(response(200, 'Success'));
}


const showTerms = catchAsync(async (req,res) => {

    const list = await courseService.queryTermsByUserId(req.user._id);
    res.status(200).send(response(200, 'Success', list));
})

const cloneCourse = catchAsync(async (req,res) => {

    const courseClone = await courseService.cloneCourseById(req);
    res.status(200).send(response(200, 'Success', courseClone));
});

const getCourseByAdmin = catchAsync(async (req,res) => {
    const course = await courseService.queryCourse(req.query);
    res.status(200).send(response(200,'Success', course));
});


module.exports = { createCourse, updateIndex, showNewCourse, showRecentCourse, deteleCourse, showTerms, cloneCourse, getCourseByAdmin }