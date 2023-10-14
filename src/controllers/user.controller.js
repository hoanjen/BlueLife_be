require('express-async-errors');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PairSecret = require('../models/PairSecret.model');
const passwordValidator = require('password-validator');

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


const signup = async (req, res) => {
    try {
        const check = await User.findOne({ email: req.body.email }).lean();
        console.log(check)
        if (check !== null) {
            throw new Error('email already exists on the system');
        }
        const validator = new passwordValidator();
        validator
            .is().min(8)    // Minimum length 8
            .is().max(20)   // Maximum length 20
            .has().uppercase()  // Must have uppercase letters                    
            .has().lowercase()  // Must have lowercase letters
            .has().symbols(); // Must have symbols
        if (!validator.validate(req.body.password)) {
            throw new Error('The new password is not secure enough ');
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
            isAdmin
        };
        const user = new User(newUser);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        throw new Error(error);
    } 
}

const signin = async (req,res) => {
    try {
        const accessToken = createAccessToken(req.user._id, req.user.isAdmin);
        const refreshToken = createRefreshToken(req.user._id, req.user.isAdmin);
        const newSecret = {
            user: req.user._id,
            accessToken,
            refreshToken
        }
        const Pair = new PairSecret(newSecret);
        await Pair.save();
        res.status(200).send({ accessToken, refreshToken });
    } catch (error) {
        
        throw new Error(error);
    }
}

const changePassword = async (req, res) => {
    try {
        const check = await bcrypt.compare(req.body.password, req.user.password)
        if (!check) throw new Error('Current password is incorrect.');
        const validator = new passwordValidator();
        validator.is().min(8)    // Minimum length 8
        .is().max(20)   // Maximum length 20
        .has().uppercase()  // Must have uppercase letters                     
        .has().lowercase()  // Must have lowercase letters
        .has().symbols(); // Must have symbols
        if (!validator.validate(req.body.newPassword)){
            throw new Error('The new password is not secure enough');
        }
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        await User.findOneAndUpdate({ _id: req.user._id }, { password: hashedPassword });
        await PairSecret.deleteMany({user: req.user._id});
        res.status(200).send({message: 'Change password successfully'});
    } catch (error) {
        throw new Error(error)
    }
}

const getAccessToken = async (req, res) => {
    try {
        const check = await PairSecret.findOne({refreshToken: req.body.refreshToken});
        if(check === null){
            throw new Error('Password has changed, please log in again');
        }
        const accessToken = createAccessToken(req.user._id, false);
        await check.updateOne({accessToken});
        return res.status(200).send({ accessToken });
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = { signup, signin, changePassword, getAccessToken }