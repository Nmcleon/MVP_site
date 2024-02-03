const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	name: {

		type: String,
		required : [true, 'Please Enter Your Name'],
		maxLength: [30,  "Name can't be more than 30 characters"],

	},
	email : {
		type: String,
		required: [true,  'Please provide your email address.'],
		unique: true,
		validate: [validator.isEmail,  'Please provide a valid email address']
		
	},
	password: {
		type: String,
		required: [true,  'A password is required'],
		minLength: [6,  'Password should have at least 6 characters'],
		select: false //hides the password field while querying (optional)
	},
	avatar: {
		public_id: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	},
	role: {
		type: String,
		default: 'user'
	},
	createdat: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date
})

module.exports = mongoose.model('User', userSchema);