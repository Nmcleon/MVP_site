const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const { TokenExpiredError } = require('jsonwebtoken');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const user = require('../models/user');


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
  
  // forgot Password => /api/v1/password/reset/token
  exports.resetPassword = catchAsyncError(async (req, res, next) => {

	//hash urltoken
	const resetPasswordToken = crypto.create('sha256').update(req.params.token).digest('hex')

	const user=await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now()} 
	})

	if(!user) {
		return next(new ErrorHandler('Password reset token is invalid or has expired', 400)
		)
	}

	//Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

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

// Get currently logged in user /api/v1/me
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    console.log("Inside current User");
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
})

//update / change password => /api/v1/password/update
// authController
// authController
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check if the old password is provided in the request body
    if (!req.body.oldPassword) {
        return next(new ErrorHandler('Old password is missing', 400));
    }

    // Check if the old password matches
    const isMatched = await user.comparePasswords(req.body.oldPassword);

    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    // Check if the new password is provided in the request body
    if (!req.body.password) {
        return next(new ErrorHandler('A password is required', 400));
    }

    // Update the password
    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
});

//update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
	const newUserData = {
		name:  req.body.name || req.user.name,
		email: req.body.email || req.user.email
	}

	//update avatar : TODO LIST
	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
		userFindAndModify:false
	})
	res.status(200).json({
		success: true
	})
})


// Admin routes 
// all users =>/v1/admin/users
exports.allUsers = catchAsyncError(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		success: true,
		users
	})
})

// Get user deails
// Get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler(`There is no such user id: ${req.params.id}`));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
});

//update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
	const newUserData = {
		name:  req.body.name || req.user.name,
		email: req.body.email || req.user.email,
		role: req.body.role
	}

	const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		userFindAndModify:false
	})
	res.status(200).json({
		success: true
	})
})

// Delete user details
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler(`There is no such user id: ${req.params.id}`));
        }

        // Remove user from the server
        await user.deleteOne(); // Use deleteOne() or findOneAndDelete() instead of remove()

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
});

