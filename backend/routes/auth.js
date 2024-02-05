const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPassword } = require('../controllers/authControler');

router.route('/register').post(registerUser);
// router.route('/login')
router.route('/login').post(loginUser);
// logout
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);

module.exports = router;
