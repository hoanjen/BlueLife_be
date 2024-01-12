
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createAccessToken = (userId, isAdmin) => {
    let infor = {
        os: 'BlueLife-access',
        id: userId,
        isAdmin,
        date: new Date().getTime(),
        expiry: new Date().getTime() + 1*24*60*60*1000 //one day
    };
    let accessToken = jwt.sign(infor, process.env.secret);
    return accessToken;
}

const createRefreshToken = (userId, isAdmin) => {
    let infor = {
        name: 'BlueLife-refresh',
        id: userId,
        isAdmin,
        date: new Date().getTime(),
        expiry: new Date().getTime() + 14 * 24 * 60 * 60 * 1000 //14 day
    }
    let refreshToken = jwt.sign(infor, process.env.secret);
    return refreshToken;
}


module.exports = { createAccessToken, createRefreshToken  }