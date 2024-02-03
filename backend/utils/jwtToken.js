// Create and send token in the cookie.
const sendToken = (user, statusCode, res) => {

	// create Jwt token
	const token = user.getJwtToken();

	//Option for cookie
	const options = {
		expires: new Date(
			Date.now() + process.env.COOKIES_EXPIRES_TIME *24 * 60 * 1000
		),
		httpOnly: true //it is to prevent client side scripting
	}

	res.status(statusCode).cookie('token', options).json({
		success: true,
		user
	})

}

module.exports = sendToken;