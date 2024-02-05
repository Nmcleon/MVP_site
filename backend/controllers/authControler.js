const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const { TokenExpiredError } = require('jsonwebtoken');
const sendToken = require('../utils/jwtToken');
const user = require('../models/user');
const sendEmail = require('../utils/sendEmail');

// Register a User => /api/v1/register

exports.registerUser = catchAsyncError( async(req, res, next) => {

	const { name, email, password }= req.body;

	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: 'samples/people/smiling-man',
			url: 'https://res.cloudinary.com/den0qr8sj/image/upload/v1706971846/samples/people/smiling-man.jpg'
		}
	})

	sendToken(user, 200, res)
})

// forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
  
	if (!user) {
	  return next(new ErrorHandler('USER NOT FOUND WITH THIS EMAIL', 404));
	}
  
	// GET RESET TOKEN
	const resetToken = user.createResetPasswordToken();
  
	await user.save({ validateBeforeSave: false });
  
	// create reset password
	const resetUrl = `${req.protocol}://${req.get(`host`)}/api/v1/password/reset/${resetToken}`;
  
	const message = `Your password reset is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
  
	try {
	  await sendEmail({
		email: user.email,
		subject: `Lore recovery password`,
		message,
	  });
  
	  res.status(200).json({
		success: true,
		message: `Email sent to: ${user.email}`,
	  });
	} catch (err) {
	  user.resetPasswordToken = undefined;
	  user.resetPasswordExpire = undefined;
  
	  await user.save({ validateBeforeSave: false });
	  return next(new ErrorHandler(err.message, 500));
	}
  })  

//  login User
exports.loginUser = catchAsyncError( async(req, res, next) => {
	const { email, password } = req.body;

	// Check if Email and password  exist
	if(!email || !password) {
		return next (new ErrorHandler("Please provide an email and password", 400));
	}

	//find user i db
	const user = await User.findOne({ email }).select('+password')

	if(!user) {
		return next(new ErrorHandler('Invalid Email or Password', 401));

	}

	//Check if Pasword is  correct
	const  isPasswordMatched = await user.comparePasswords(password);

	if(!isPasswordMatched) {
		return next(new ErrorHandler('Invalid Email or Password', 401));
	}

	sendToken(user, 200, res)
	/*
	const  token = user.getJwtToken();

	res.status(200).json({
		success: true,
		token
	})*/
})

//logout user => /api/vi/logout
exports.logout = catchAsyncError(async(req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true

	})

	res.status(200).json({
		success: true,
		message: 'Logged out'
	})
}) 
