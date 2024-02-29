const passport = require('passport');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User.model');
require('dotenv').config();
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
        secretOrKey: process.env.secret
    },
    async (payload, done) => {
        
        try {
            if (payload.expiry <= new Date().getTime()){
                throw new ApiError(httpStatus.UNAUTHORIZED,'Tokens expire');
            }
            const user = await User.findById(payload.id).lean();
            if (!user) throw new ApiError(httpStatus.FORBIDDEN, 'FORBIDDEN');
            done(null, user);
        }
        catch (error) {
            done(new ApiError(httpStatus.UNAUTHORIZED, 'UNAUTHORIZED'), false);
        }
}))


passport.use(new localStrategy({
    usernameField: 'email'  
}, async (email,password, done) => {
    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            throw new Error('Incorrect username or password.');
        }
        const check = await bcrypt.compare(password, user.password)
        if (!check) throw new Error('Incorrect username or password.');
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }

}))


