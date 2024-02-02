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

//Get single Product => /api/vi/product/:id

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