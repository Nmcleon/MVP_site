const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || 'Internal Server Err';

	res.status(err.statusCode).json({
		sucess: false,
		error: err.message,
		stack: err.stack //for dev mode, 
	})


}

/***tried implementing a production mode, failed misserably(MASSIVE Ls)
 const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || 'Internal Server Err';

	if (process.env.NODE_ENV === 'development') {
		res.status(err.statusCode).json({
			success: false,
			error: err,
			errMessage: err.message,
			stack: err.stack
		});
	} else if (process.env.NODE_ENV === 'production') {
		res.status(err.statusCode).json({
			success: false,
			message: err.message || 'Internal Server Error'
		});
	}
}

*/