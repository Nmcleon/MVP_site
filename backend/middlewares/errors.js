const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || 'Internal Server Err';

	//for production 
	//wrong Mongoose Object ID Error
	if(err.name === 'CaseError') {
		const message = `Resource not found. Invalid: ${err.path}`
		error = new ErrorHandler(message, 400)
	}

	//Handle Mongoose Validation Err
	if(err.name === 'ValidationError') {
		const message = Object.values(err.values).map(value => value.message);
		error = new ErrorHandler(message, 400) 
	} 

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