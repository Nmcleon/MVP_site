const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPassword, resetPassword } = require('../controllers/authControler');

router.route('/register').post(registerUser);
// router.route('/login')
router.route('/login').post(loginUser);
// logout
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

module.exports = router;
