require('express-async-errors');
const User = require('../models/User.model');
const PairSecret = require('../models/PairSecret.model');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const httpStatus = require('http-status');
const response  = require('../utils/response');

const signup = catchAsync(async (req, res) => {
    console.log(req);
    const newUser = await userService.createUser(req);
    const user = new User(newUser);
    await user.save();
    res.status(httpStatus.CREATED).send(response(httpStatus.CREATED,httpStatus.CREATED.toString(), user));
});

const signin = catchAsync(async (req,res) => {
    const newSecret = userService.createPairSecret(req.user._id, false);
    const Pair = new PairSecret(newSecret);
    await Pair.save();
    res.status(200).send(response(200,'Login successfully',{ accessToken, refreshToken }));
});

const changePassword = async (req, res) => {
    const hashedPassword = await userService.getNewPassword(req.body.password, req.user.password, req.body.newPassword);
    await User.findOneAndUpdate({ _id: req.user._id }, { password: hashedPassword });
    await PairSecret.deleteMany({user: req.user._id});
    res.status(200).send(response(200, 'Change password successfully'));
}

const getAccessToken = async (req, res) => {

    const accessToken = await userService.getAccessToken(req.body.refreshToken);
    
    return res.status(200).send({ accessToken });
}


module.exports = { signup, signin, changePassword, getAccessToken }