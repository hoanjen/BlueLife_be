const catchAsync = require("../utils/catchAsync");
const roleService = require('../services/role.service');
const response = require("../utils/response");

const createNewRole = catchAsync(async (req, res) => {
   const role = await roleService.createNewRoleByUserId(req.user._id, req.body.roleName);
   res.status(201).send(response(201, 'Add role success', role));
})

const getRole = catchAsync(async (req, res) => {
   const role = await roleService.getRoleById(req.user._id);
   res.status(201).send(response(200, 'Success', role));
})

const queryRoles = catchAsync(async (req, res) => {
   const role = await roleService.queryRole(req.query);
   res.status(201).send(response(200, 'Success', role));
})

const deleteRole = catchAsync(async (req, res) => {
   const role = await roleService.deleteRoleById(req.user._id, req.body.roleId);
   res.status(201).send(response(200, 'Success', role));
})


module.exports = { createNewRole, queryRoles, getRole, deleteRole }