const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')


//create new roduct => api/v1/product/new
exports.newProduct = catchAsyncErrors (async(req, res, next) => {

	const product = await Product.create(req.body);

	res.status(201).json({
		sucess: true,
		product
	})
})

//Get products => /api/v1/products
exports.getProducts = catchAsyncErrors (async (req, res, next) => {

	const resPerPage = 4;
	const productCount = await Product.countDocuments();
	
	const apiFeatures = new APIFeatures(Product.find(), req.query)
						.search()
						.filter()
						.pagination(resPerPage)

	const products = await apiFeatures.query;

	res.status(200).json({
		sucess: true,
		count: products.length,
		message:  'List of all products',
		productCount,
		data: products
	})
})

//Get single Product => /api/vi/products/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return next(new ErrorHandler('Product not found', 404));
		}

		res.status(200).json({
			success: true,
			data: product
		});

	} catch (err) {
		next(err);
	}
})


// Update product => /api/v1/admin/products/:id
exports.updateProduct =catchAsyncErrors(async (req, res, next) => {

	let product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	product = await Product.findByIdAndUpdate(req.params.id,  req.body, { 
		new: true, // return the updated data
		runValidators: true,
		useFindAndModify: false // To avoid error when using findOneAndUpdate()
	});

	res.status(200).json({
		success: true,
		data: product
	})
})

// Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	await product.deleteOne(); //use deleteOne in place of remove

	res .status(204).json({
		success: true,
		message:  "Product deleted"
		}) 
})