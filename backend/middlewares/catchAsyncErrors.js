const ErrorHandler = require('../utils/errorHandler');

module.exports = func => (req, res, next) =>
  Promise.resolve(func(req, res, next))
    .catch(err => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        const error = new ErrorHandler(message, 400);
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        next(err); // Pass the error to the default error handler
      }
    });
