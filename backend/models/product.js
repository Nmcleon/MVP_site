const { default: mongoose } = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter Product Name'], // Fix typo here
    trim: true,
    maxLength: [100, "Product name can't be more than 100 characters"]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Value must be greater or equal to 1'],
    maxLength: [5, 'Invalid price length'],
    default: 0.0
  },
  description: {
    type: String,
    required: [true, 'Description field cannot be empty']
  },
  ratings: {
    type: Number,
    default: 0
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
    required: [true, 'Category is required'],
    enum: {
      values: [
        'White Wine',
        'Red Wine',
        'Rose Wine',
        'Sparkling Wine', // Fixed typo here
        'Dessert Wine',
      ],
      message: 'Enter valid category'
    }
  },
  seller: {
    type: String,
    required: [true, 'Seller field cannot be empty']
  },
  stock: {
    type: Number,
    required: [true, 'Stock field cannot be empty'],
    maxLength: [5, "The value of stock must not exceed 5 characters"],
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      name: {
        type: String,
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
    }
  ],
  /* add use who created produt massive fail
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },*/
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);