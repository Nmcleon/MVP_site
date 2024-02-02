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
		products
	})
}