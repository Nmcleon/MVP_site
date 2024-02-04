const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const { TokenExpiredError } = require('jsonwebtoken');
const sendToken = require('../utils/jwtToken');


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
