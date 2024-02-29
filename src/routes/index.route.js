const userRouter = require('./user.route')
const courseRouter = require('./course.route')
const roleRouter = require('./role.route')
require('express-async-errors')

function route(app){
    app.use('/user', userRouter);
    app.use('/course', courseRouter);
    app.use('/role', roleRouter);
}

module.exports = route