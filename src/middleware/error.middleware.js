const errorHandler = (err,req,res,next) => {

    const error = {
        status: "ERROR",
        error: err.message
    }
    return res.status(400).json(error);
};

module.exports = errorHandler