const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//create oreder that goue to => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
	const {
		orderItems,
		shippingInfo,
		itemPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo
	} = req.body;

	const order = await Order.create ({
		orderItems,
		shippingInfo,
		itemPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo,
		paidAt: Date.now(),
		user: req.user._id
	})

	res.status(200).json({
		success: true,
		order
	})
})

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async(req, res, next) => {
	const order = await Order.findById(req.params.id).populate('user', 'name email')

	if(!oreder) {
		return net
	}
})