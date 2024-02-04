const express = require('express');
const router = express.Router();

const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const{ isAuthenticatedUser } = require('../middlewares/auth');
// Products routes
router.route('/products').get(isAuthenticatedUser, getProducts);
router.route('/product/new').post(newProduct);

// Admin routes
router.route('/admin/products/:id').get(getSingleProduct);
router.route('/admin/products/:id').put(updateProduct);
router.route('/admin/products/:id').delete(deleteProduct);

module.exports = router;
