const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncErrors');


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

	const token = user.getJwtToken();

	res.status(201).json({
		success: true,
		token
		})
})

//
