const express = require('express')
const router = express.Router()
require('express-async-errors')
require ('../middleware/passport.middleware')
const passport = require('passport')
const { signup, signin, changePassword, getAccessToken, test } = require('../controllers/user.controller')
const { userValidation } = require('../validations')
const validate = require('../middleware/validate.middleware')

router.post('/signup', validate(userValidation.createUser) ,signup)
router.post('/signin', validate(userValidation.signin) ,passport.authenticate('local', { session: false }), signin)
router.put('/changePassword', validate(userValidation.changePassword), passport.authenticate('jwt', { session: false }), changePassword)
router.put('/getAccessToken', validate(userValidation.getAccessToken)  ,getAccessToken)

module.exports = router