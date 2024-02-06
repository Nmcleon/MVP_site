const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')


//create new roduct => api/v1/product/new
exports.newProduct = catchAsyncErrors (async(req, res, next) => {

	 /* massive L
	  Ensure req.user is available and contains the authenticated user's information
 if (!req.user) {
    return next(new AppError('Authentication failed', 401));
 }
	req.body.user = req.user.id; // add user who created the product
	*/
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


/** REVIEWS **/

//create new review => /api/v1/review
//create new review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);
    
    if (!product || !product.reviews || !Array.isArray(product.reviews)) {
        return next(new ErrorHandler('Product or reviews not found', 404));
    }

    const existingReviewIndex = product.reviews.findIndex(
        r => r.user && r.user.toString() === req.user._id.toString()
    );

    if (existingReviewIndex !== -1) {
        // Update existing review
        product.reviews[existingReviewIndex].comment = comment;
        product.reviews[existingReviewIndex].rating = rating;
    } else {
        // Add new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
})

// get product reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.query.id);

	res.status(200).json({
		success: true,
		reviews: product.reviews
	})
})

// Delete product reviews => /api/v1/reviews
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler('Product not found',  404));
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length; // Corrected variable name

    const ratings = reviews.reduce((acc, item) => item.rating + acc,  0) / numOfReviews; // Use numOfReviews instead of reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numberOfReviews: numOfReviews // Set the numberOfReviews field to numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })
})
