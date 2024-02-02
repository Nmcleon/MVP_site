const { default: mongoose } = require('mongoose')

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [type, 'Enter Product Name'],
		trim: true,
		maxLength: [100,  "Product name can't be more than 100 characters"]
	},
	price: {
		type: Number,
		required: [true, 'Price is required'],
		min: [1, 'Value must be greater or equal to 1'],
		maxLength: [5,  'Invalid price length'],
		default: 0.0
	},
	decription: {
		type: String,
		required: [true,  'Description field cannot be empty']
	},
	ratings: {
		type: Number,
		default:  0
	},
	images: [
		{
			public_id: {
				type: String,
				required: true
			},
			url: {
				type: String,
				required: true
			},
		}
	],
	category: {
		type: String,
		required: [true,  'Category is required'],
		enum: {
			values: [
				'Wite wine', 
				'Red Wine', 
				'Rose Wine',
				'BSparkling Winer',
				'Dessert Wine',
			],
			message:  'Enter valid category'
		}
	},
	seller: {
		type: String,
		required: [true,  'Seller field cannot be empty']
	},
	stock: {
		type: Number,
		required: [true,'Stock field cannot be empty'],
		maxLength: [5,  "The value of stock must not exceed 5 characters"],
		default: 0
		},
	numOfReviews: {
		type: Number,
		default: 0
	},
	reviews: [
		{
			name: {
				type:String,
				required: true
			},
			rating: {
				type: Number,
				required: true
			},
			comment: {
				type: String,
				required: true
			}
		}],
		createdAt: {
			type: Date,
			default: Date.now
		}
	}
)

module.exports = mongoose.model('product', productSchema);