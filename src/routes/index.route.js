const userRouter = require('./user.route')
const courseRouter = require('./course.route')
require('express-async-errors')

function route(app){
    app.use('/user', userRouter);
    app.use('/course', courseRouter);
}

module.exports = route