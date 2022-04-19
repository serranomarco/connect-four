//utility file with middleware for express application

//wrapper function that catches async errors
const asyncHandler = (handler) => (req, res, next) => {
    handler(req, res, next).catch(next);
};

module.exports = { asyncHandler };