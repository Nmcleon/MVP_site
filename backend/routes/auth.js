const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authControler');

router.route('/register').post(registerUser);
// router.route('/login')
router.route('/login').post(loginUser);

module.exports = router;
