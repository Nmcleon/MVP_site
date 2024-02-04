const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout } = require('../controllers/authControler');

router.route('/register').post(registerUser);
// router.route('/login')
router.route('/login').post(loginUser);
// logout
router.route('/logout').get(logout);


module.exports = router;
