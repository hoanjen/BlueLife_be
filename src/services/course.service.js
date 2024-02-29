const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError');
const termService = require('../services/term.service');
const Course = require('../models/Course.model');
const IndexToUpdate = require('../models/IndexToUpdate.model');
const Term = require('../models/Term.model');
const pick = require('../utils/pick');


const createNewCourse = async (req) => {
   const newCourse = {
      user: req.user._id,
      nameCourse: req.body.name,
      updateIndex: new Date().getTime(),
      access: req.body.access,
      totalTerm: req.body.terms.nameTerm.length
   }

   

   const course = new Course(newCourse);

   await course.save();
   await termService.createTerm(course._id, req.body.terms.nameTerm, req.body.terms.mean);

   return course;
}


const updateIndexCourseClick = async (courseId, userId) =>{

   if (await IndexToUpdate.findOne({ course: courseId, user: userId }) === null) {
      const newIndexToUpdate = new IndexToUpdate({
         course: courseId,
         user: userId,
         updateIndex: new Date()
      })
      await newIndexToUpdate.save();
   }
   else {
      await IndexToUpdate.findOneAndUpdate({ course: courseId, user: userId }, { updateIndex: new Date() });
   }
}

const showNewCourses = async (userId,limitString) => {
   const limit = limitString ? parseInt(limitString) : 16;
  
   const courseList = await Course.aggregate([
      {
         $lookup:
         {
            from: 'courses', localField: 'course', foreignField: '_id', as: 'course'
            , "pipeline": [
               {
                  $match: { $or: [{ access: 'public' }, { user: userId }] }
               },
               {
                  $project: {
                     _id: true,
                     nameCourse: true,
                     updateIndex: true,
                     totalTerm: true,
                     user: true
                  }
               }]
         }
      },
      {
         $lookup:
         {
            from: 'users', localField: 'user', foreignField: '_id', as: 'users'
            , "pipeline": [{
               $project: {
                  user: true,
                  name: true,
                  avatar: true
               }
            }]
         }
      },
      { $match: { access: { $in: ['public'] } } },
      { $sort: { createdAt: -1 } },
      { $limit: limit }
   ])
   return courseList;
}

const showRecentCourses = async (userId, options)=> {
   const limit = parseInt(options.limit ? options.limit : 10);
   const page = parseInt(options.page ? options.limit : 1);
   let recentList = await IndexToUpdate.aggregate([
      {
         $facet: {
            metaData: [
               {$count : "total"},
               { $addFields: {
                  pageNumber: page,
                  totalPage: { $ceil: { $divide: ["$total", limit] } },
                  }
               }
            ],
            data: [
               { $match: { user: userId } },
               { $sort: { updateIndex: -1 } },
               { $limit: limit },
               { $skip: (page - 1)*limit },
               {
                  $lookup:
                  {
                     from: 'courses', localField: 'course', foreignField: '_id', as: 'course'
                     , "pipeline": [
                        {
                           $match: { $or: [{ access: 'public' }, { user: userId }] }
                        },
                        {
                           $project: {
                              _id: true,
                              nameCourse: true,
                              updateIndex: true,
                              totalTerm: true,
                              user: true
                           }
                        }]
                  }
               },
               {
                  $lookup: {
                     from: 'users', localField: 'user', foreignField: '_id', as: 'user'
                     , "pipeline": [{
                        $project: {
                           user: true,
                           name: true,
                           avatar: true
                        }
                     }]
                  }
               }
            ]
         }
      }
   ])
   recentList = recentList[0];
   recentList = { ...recentList.metaData[0], data: recentList.data }
   return recentList;

}

const deleteCourseById = async (req)=> {
   if(req.roles.includes('admin')){
      const check = await Course.deleteOne({ _id: req.body.delete });
      if (check.deletedCount !== 0) {
         await Term.deleteMany({ course: req.body.delete });
      }
      else {
         throw new ApiError(400, 'course does not exist');
      }
   }
   else if( req.roles.includes('customer')){
      
      const check = await Course.deleteOne({ user: req.user._id, _id: req.body.delete });
      if (check.deletedCount !== 0) {
         await Term.deleteMany({ course: req.body.delete });
      }
      else {
         throw new ApiError(400, 'course does not exist');
      }
   }
}

const queryTermsByUserId = async (userId) => {
   const list = await Course.aggregate([
      { $match: { user: userId } },
      {
         $lookup: {
            from: 'terms', localField: '_id', foreignField: 'course', as: 'terms'
         }
      }
   ])
   return list;
}

const cloneCourseById = async (req) => {
   const cloneCourse = await Course.findById(req.body.id).lean();
   const newCourse = new Course({
      user: req.user._id,
      nameCourse: cloneCourse.nameCourse + " clone",
      updateIndex: new Date().getTime(),
      access: cloneCourse.access,
      totalTerm: cloneCourse.totalTerm
   });
   const successCourse = await newCourse.save();
   const listTerm = await Term.find({ course: cloneCourse._id }).lean();
   const listPromise = [];
   listTerm.forEach((term) => {
      const newTerm = new Term({
         course: successCourse._id,
         nameTerm: term.nameTerm,
         mean: term.mean
      })
      listPromise.push(newTerm.save());
   }
   )

   await Promise.all(listPromise);
   return successCourse;
}

const queryCourse = async (query) => {
   const filter = pick(query, ['user']);

   const options = pick(query, ['sortBy', 'limit', 'page', 'populate']);

   const course = await Course.paginate(filter, options);
   return course;
}

module.exports = { createNewCourse, updateIndexCourseClick, showNewCourses, showRecentCourses, deleteCourseById, queryTermsByUserId, cloneCourseById, queryCourse }