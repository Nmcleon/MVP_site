const express = require('express')
const router = express.Router();

const { newOrder, getSingleOrder, myOrder } = require('../controllers/orderController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder );
router.route('/order/me').get(isAuthenticatedUser, myOrder);



module.exports = router;