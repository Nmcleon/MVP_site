const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');
const { connect } = require('mongoose');

//set .env
dotenv.config({ path: 'backend/config/config.env' });

connectDatabase();

const seedProducts = async () => {
	try{

		await Product.deleteMany();
		console.log( 'Data deleted successfully' );

		await Product.insertMany(products)
		console.log(  `Products inserted in the database`);

		process.exit();

	} catch(err) {
		console.log(err.message);
		process.exit();
	}
}

seedProducts()