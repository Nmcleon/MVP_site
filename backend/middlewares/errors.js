const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || 'Internal Server Err';

	res.status(err.statusCode).json({
		sucess: false,
		error: err.message,
		stack: err.stack
	})


}