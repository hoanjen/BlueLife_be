const Joi = require('joi');

const createCourse = {
   body: Joi.object().keys({
      name: Joi.string().required(),
      access: Joi.string().required(),
      terms: Joi.object().keys({
         nameTerm: Joi.array().required(),
         mean: Joi.array().required(),
      }),
   }),
};

const updateIndex = {
   body: Joi.object().keys({
      courseId: Joi.string().required(),
   }),
};

const deleteCourse = {
   body: Joi.object().keys({
      delete: Joi.string().required(),
   }),
};
const cloneCourse = {
   body: Joi.object().keys({
      id: Joi.string().required(),
   }),
};

const showMyCourse = {
   query: Joi.object().keys({
      limit: Joi.number(),
      page: Joi.number(),
   })
}

const getCourse = {
   query: Joi.object().keys({
      limit: Joi.number(),
      page: Joi.number(),
   })
}



module.exports = { createCourse, updateIndex, showMyCourse, deleteCourse, cloneCourse, getCourse } 