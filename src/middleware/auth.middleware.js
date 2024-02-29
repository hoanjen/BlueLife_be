const catchAsync = require("../utils/catchAsync");
const tokenService = require('../services/token.service');
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const jwt = require('jsonwebtoken')
require('dotenv').config();
const User = require('../models/User.model');
const Role = require('../models/Role.model');




const auth = catchAsync( async (req,res, next) => {
   const token = tokenService.extractTokenFromHeader(req);
   if(!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
   }
   const payload = jwt.verify(token, process.env.secret);
   const user = await User.findById(payload.id).lean();
   if (!user) throw new ApiError(httpStatus.FORBIDDEN, 'FORBIDDEN');
   req.user = user;
   next();
});

const authorize = (rolesAllow = []) => async (req, res, next) => {
   try {
      const userId = req.user._id;
   
      const queryRole = await Role.find({user: userId});
      const flatten  = rolesAllow.join(" ");
      let allow = false;
      queryRole.forEach((role) => {
         if (flatten.includes(role.roleName)){
            allow = true;
         }
      })

      if(allow){
         req.roles = queryRole;
         return next();
      }
      next(new ApiError(httpStatus.UNAUTHORIZED, 'UNAUTHORIZED'))
   } catch (error) {
      next(new ApiError(error.status, error.message));
   }
}

module.exports = { auth, authorize }