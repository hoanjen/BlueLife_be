const ApiError = require('../utils/ApiError');
const response = require('../utils/response');
const httpStatus = require('http-status');

const errorHandler = (err, req, res) => {
    console.log(err.stack);
    res.status(err.statusCode).send(response(err.statusCode,err.message));
}

const errorToApiError = (err, req, res, next ) => {
    let error = err
    if(err instanceof Error){
        error = new ApiError(httpStatus[400], err.message, true, err.stack);
    }
    next(error);
}

module.exports = { errorHandler , errorToApiError }