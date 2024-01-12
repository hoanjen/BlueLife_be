const Joi = require('joi');

const createUser = {
   body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
      username: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      passwordAgain: Joi.ref('password'),
   }),
};

const signin = {
   body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
   }),
};

const changePassword = {
   body: Joi.object().keys({
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
   }),
};

const getAccessToken = {
   body: Joi.object().keys({
      refreshToken: [
         Joi.string(),
         Joi.number()
      ],
   }),
};


module.exports = {
   createUser,
   signin,
   changePassword,
   getAccessToken,
};