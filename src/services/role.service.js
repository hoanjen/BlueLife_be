const httpStatus = require('http-status');
const Role = require('../models/Role.model');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick')

const createNewRoleByUserId = async (userId, roleName) => {

   const roleCheck = await Role.findOne({roleName, user: userId});
   if(roleCheck){
      throw new ApiError(400, `The user already has this ${roleName}`);
   }
   const newRole = {
      user: userId,
      roleName
   }

   const role = new Role(newRole);

   await role.save();
   return role;
}

const queryRole = async (query) => {
   const filter = pick(query, ['user']);

   const options = pick(query, ['sortBy', 'limit', 'page', 'populate']);

   const roles = await Role.paginate(filter, options);
   return roles;
}
const getRoleById = async (userId) => {
   const role = await Role.find({ user: userId });
   return role;
}

const deleteRoleById = async (userId, roleId) => {
   const role = await Role.deleteOne({ user: userId , _id: roleId});
   return role;
}

module.exports = { createNewRoleByUserId, queryRole, getRoleById, deleteRoleById }