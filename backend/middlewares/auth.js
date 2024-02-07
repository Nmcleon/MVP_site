const User = require('../models/user')
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// Check user Authentication
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
	console.log(req.cookies);
	const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Login to access resource', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
  /*
if (!token || typeof token !== 'string') {
  return next(new ErrorHandler('Login to access resource', 401));
}

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
} catch (error) {
  console.error('Token Verification Error:', error);
  return next(new ErrorHandler('Invalid token', 401));
}
*/

})

// handling user roles
exports.authorizeRoles =(...roles) => {
	return (req, res, next) => {
		if(!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))
		}
		next()
	} 
}

