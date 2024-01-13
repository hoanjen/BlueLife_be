
const httpStatus = require('http-status');
const Role = require('../models/Role.model');


const authorize = (rolesAllow) => async (req, res, next) => {
  rolesAllow.forEach( async (role)  => {
    const roleNow = await Role.findOne({ roleIndex: role });
    const roleId = roleNow?._id;
    if (req.user.roles.includes(roleId)) {
      return next();
    }
  });
    return next(new ApiError(httpStatus.FORBIDDEN, 'Không có quyền'));
};

module.exports = { authorize };