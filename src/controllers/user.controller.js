require('express-async-errors');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PairSecret = require('../models/PairSecret.model');
const passwordValidator = require('password-validator');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const httpStatus = require('http-status');
const response  = require('../utils/response');
const ApiError = require('../utils/ApiError');

const signup = catchAsync(async (req, res) => {
    const newUser = await userService.createUser(req);
    const user = new User(newUser);
    await user.save();
    res.status(httpStatus[201]).send(response(httpStatus[201],httpStatus[201].toString(), user));
});

const signin = catchAsync(async (req,res) => {
    const newSecret = userService.createPairSecret(req);
    const Pair = new PairSecret(newSecret);
    await Pair.save();
    res.status(200).send(response(200,'Login success',{ accessToken, refreshToken }));
});

const changePassword = async (req, res) => {
    const hashedPassword = userService.getNewPassword(req);
    await User.findOneAndUpdate({ _id: req.user._id }, { password: hashedPassword });
    await PairSecret.deleteMany({user: req.user._id});
    res.status(200).send({message: 'Change password successfully'});
}

const getAccessToken = async (req, res) => {
    const accessToken = userService.getAccessToken(req);
    await pairSecret.updateOne({accessToken});
    return res.status(200).send({ accessToken });
}
const test = catchAsync(async (req,res)=>{
    return res.status(200).send({ a: new Date()});
});


module.exports = { signup, signin, changePassword, getAccessToken, test }