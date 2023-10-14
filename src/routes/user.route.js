const express = require('express')
const router = express.Router()
require('express-async-errors')
require ('../middleware/passport.middleware')
const passport = require('passport')
const { signup, signin, changePassword, getAccessToken } = require('../controllers/user.controller')

router.post('/signup',signup)
router.post('/signin', passport.authenticate('local', { session: false }), signin)
router.put('/changePassword', passport.authenticate('jwt', { session: false }), changePassword)
router.get('/getAccessToken', passport.authenticate('jwt', { session: false }), getAccessToken)


module.exports = router