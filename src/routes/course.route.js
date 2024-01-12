const express = require('express')
const router = express.Router()
require('express-async-errors')
require('../middleware/passport.middleware')
const passport = require('passport')
const { createCourse, updateIndex, showNewCourse, showRecentCourse, deteleCourse, showTerms, cloneCourse } = require('../controllers/course.controller')

router.post('/createCourse', passport.authenticate('jwt', { session: false }), createCourse);
router.put('/updateIndex', passport.authenticate('jwt', { session: false }), updateIndex);
router.get('/showRecentCourse', passport.authenticate('jwt', { session: false }), showRecentCourse);
router.delete('/deteleCourse', passport.authenticate('jwt', { session: false }), deteleCourse);
router.get('/showTerms', passport.authenticate('jwt', { session: false }), showTerms);
router.post('/cloneCourse', passport.authenticate('jwt', { session: false }), cloneCourse);
router.get('/showNewCourse', showNewCourse);


module.exports = router