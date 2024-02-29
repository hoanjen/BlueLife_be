const express = require('express')
const router = express.Router()
require('express-async-errors')
require('../middleware/passport.middleware')
const { createCourse, updateIndex, showNewCourse, showRecentCourse, deteleCourse, showTerms, cloneCourse, getCourseByAdmin } = require('../controllers/course.controller')
const { courseValidation } = require('../validations');
const validate = require('../middleware/validate.middleware')
const { auth, authorize } = require('../middleware/auth.middleware')

router.post('/createCourse', validate(courseValidation.createCourse), auth, createCourse);
router.put('/updateIndex', validate(courseValidation.updateIndex), auth, updateIndex);
router.get('/showRecentCourse', auth, showRecentCourse);
router.delete('/deteleCourse', validate(courseValidation.deleteCourse), auth, deteleCourse);
router.get('/showTerms', auth, showTerms);
router.post('/cloneCourse',validate(courseValidation.cloneCourse), auth, cloneCourse);
router.get('/showNewCourse', validate(courseValidation.showMyCourse), auth,  showNewCourse);
router.get('/getCourse', auth, getCourseByAdmin);


module.exports = router;