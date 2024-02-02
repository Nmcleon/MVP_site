exports.getProducts = (req, res, next) => {
	res.status(200).jsaon({
		sucess: true,
		message:  'List of products'
	})
}