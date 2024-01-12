const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PairSecret = require('../models/PairSecret.model');
const tokenService = require('../services/token.service');

const createUser = async (req) => {
    const check = await User.findOne({ email: req.body.email }).lean();
    if (check !== null) {
        throw new ApiError(httpStatus[400],'email already exists on the system');
    }
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    let isAdmin = false;
    if(req.secret === 'hoanjen'){
        isAdmin = true;
    }
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        usename: req.body.username,
        isAdmin
    };
    return newUser;
}

const createPairSecret = async (req) => {
    const accessToken = tokenService.createAccessToken(req.user._id, req.user.isAdmin);
    const refreshToken = tokenService.createRefreshToken(req.user._id, req.user.isAdmin);
    const newSecret = {
        user: req.user._id,
        accessToken,
        refreshToken
    }
    return newSecret;
}

const getNewPassword = async (req) => {
    const check = await bcrypt.compare(req.body.password, req.user.password)
    if (!check) throw new ApiError(400,'Current password is incorrect.');
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    return hashedPassword;
}

const getAccessToken = async (req) => {
    const data = await jwt.verify(req.body.refreshToken,process.env.secret);
    console.log(data);
    const pairSecret = await PairSecret.findOne({refreshToken: req.body.refreshToken});
    if(pairSecret === null){
        throw new ApiError(400,'Password has changed, please log in again');
    }
    const accessToken = tokenService.createAccessToken(req.user._id, false);

    return accessToken;
}

module.exports = { createUser, createPairSecret, getNewPassword, getAccessToken }