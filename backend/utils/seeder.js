const Product = Require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const product = require('../data/products');
const { connect } = require('mongoose');

//set .env
dotenv.config({ path: 'backernd/config/config.env' })

connectDatabase();

const seedProducts = async () => {
	try{

		await Product.deleteMany();
		console.log( "Data deleted successfully" );

		await Product.inserMany(products)
		console.log(  `Total ${products.length} products inserted in the database`);

		process.exit();

	} catch(err) {
		console.log(err.message);
		process.exit();
	}
}

seedProducts()