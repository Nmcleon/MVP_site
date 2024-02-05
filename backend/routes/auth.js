const express = require('express');
const router = express.Router();


const { 
	registerUser, 
	loginUser, 
	logout, 
	forgotPassword, 
	resetPassword,
	getUserProfile,
	updatePassword 
} = require('../controllers/authControler');

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/register').post(registerUser);
// router.route('/login')
router.route('/login').post(loginUser);
// logout
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

module.exports = router;
