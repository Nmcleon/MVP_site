exports.getProducts = (req, res, next) => {
	res.status(200).json({
		sucess: true,
		message:  'List of products'
	})
}