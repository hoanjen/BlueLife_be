require('express-async-errors');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const httpStatus = require('http-status');
const response  = require('../utils/response');

const signup = catchAsync(async (req, res) => {
    console.log(req);
    const newUser = await userService.createUser(req);
    res.status(httpStatus.CREATED).send(response(httpStatus.CREATED, httpStatus.CREATED.toString(), newUser));
});

const signin = catchAsync(async (req,res) => {
    const newSecret = await userService.createPairSecret(req.user._id, false);
    res.status(200).send(response(200, 'Login successfully', newSecret));
});

const changePassword = async (req, res) => {
    console.log(22222222)
    const hashedPassword = await userService.getNewPassword(req.user._id, req.body.password, req.user.password, req.body.newPassword);
    res.status(200).send(response(200, 'Change password successfully'));
}

const getAccessToken = async (req, res) => {

    const accessToken = await userService.getAccessToken(req.body.refreshToken);

    return res.status(200).send(response(200,'Success',accessToken));
}


module.exports = { signup, signin, changePassword, getAccessToken }