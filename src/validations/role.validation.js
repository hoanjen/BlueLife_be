const Joi = require('joi');

const createNewRole = {
   body: Joi.object().keys({
      roleName: Joi.string().required(),
   }),
};




module.exports = { createNewRole  }