const Product = require('../models/product')

//create new roduct => api/v1/product/new
exports.newProduct = async (req, res, next) => {

	const product = await Product.create(req.body);

	res.status(201).json({
		sucess: true,
		product
	})
}

//Get products => /api/v1/products
exports.getProducts = async (req, res, next) => {

	const products = await Product.find();

	res.status(200).json({
		sucess: true,
		count: products.length,
		message:  'List of all products',
		data: products
	})
}

//Get single Product => /api/vi/products/:id

exports.getSingleProduct = async (req, res, next) => {

	const product = await Product.findById(req.params.id);

	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}

	res.status(200).json({
		success:true,
		data: product
	})
}

// Update product => /api/v1/admin/products/:id
exports.updateProduct = async (req, res, next) => {

	let product = await Product.findById(req.params.id);

	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
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
}

// Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {

	const product = await Product.findById(req.params.id);

	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}

	await product.deleteOne(); //use deleteOne in place of remove

	res .status(204).json({
		success: true,
		message:  "Product deleted"
		}) 
}