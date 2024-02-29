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
        throw new ApiError(400,'email already exists on the system');
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
    const user = new User(newUser);
    await user.save();
    return user;
}

const createPairSecret = async (userId, isAdmin) => {
    const accessToken = tokenService.createAccessToken(userId, isAdmin);
    const refreshToken = tokenService.createRefreshToken(userId, isAdmin);
    const newSecret = {
        user: userId,
        accessToken,
        refreshToken
    }
    const pair = new PairSecret(newSecret);
    await pair.save();
    return pair;
}

const getNewPassword = async (userId ,passwordReq, password, newPassword) => {

    const check = await bcrypt.compare(passwordReq, password)
    if (!check) throw new ApiError(400,'Current password is incorrect.');
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate({ _id: userId }, { password: hashedPassword });
    await PairSecret.deleteMany({ user: userId });
    return hashedPassword;
}

const getAccessToken = async (refreshToken, userId) => {
    const data = await jwt.verify(refreshToken,process.env.secret);
    if(data.expiry <= new Date().getTime()){
        throw new ApiError(401, 'Please log in again');
    }
    const pairSecret = await PairSecret.findOne({refreshToken});
    if(pairSecret === null){
        throw new ApiError(401,'Password has changed, please log in again');
    }
    const accessToken = tokenService.createAccessToken(userId, false);
    await pairSecret.updateOne({ accessToken });
    return accessToken;
}

module.exports = { createUser, createPairSecret, getNewPassword, getAccessToken }