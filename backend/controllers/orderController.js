const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const order = require('../models/order');

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
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// Get logged-in user orders => /api/v1/order/me
exports.myOrder = catchAsyncErrors(async (req, res, next) => {
	const orders = await Order.find({ user: req.user.id });
  
	if (!orders) {
	  return next(new ErrorHandler('No Orders found for this user', 404));
	}
  
	res.status(200).json({
	  success: true,
	  orders,
	});
  });

// Get all orders admin => /api/v1/admin/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// Update process order admin => /api/v1/admin/order/:id
exports.updateOrders = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Order is already delivered', 400));
    }

    order.orderItems.forEach(async (item) => {
        // Reduce the product quantity in stock
        await updateStock(item.product, item.quantity);
    });

    // Fix here: change req.body.status to req.body.orderStatus
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save(/*{ validateBeforeSave: false }*/);
}

// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return next(new ErrorHandler('No Order found with this ID', 404));
        }

        await order.deleteOne(); // Changed to delete one

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        // Handle any unexpected errors
        return next(new ErrorHandler('Error deleting order', 500));
    }
});

