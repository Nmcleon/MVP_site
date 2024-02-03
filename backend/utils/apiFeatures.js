class APIFeatures {
	constructor(query, queryStr) {
	  this.query = query;
	  this.queryStr = queryStr;
	}
  
	search() {
	  const keyword = this.queryStr.keyword
		? {
			name: {
			  $regex: this.queryStr.keyword,
			  $options: 'i',
			},
		  }
		: {};
  
	  console.log(keyword);
	  this.query = this.query.find({ ...keyword });
	  return this;
	}
  
	filter() {
		const queryCopy = { ...this.queryStr };
		// Remove irrelevant fields
		const removeFields = ['keyword', 'limit', 'page'];
		removeFields.forEach((el) => delete queryCopy[el]);
	  
		// Filter by keyword
		if ('keyword' in queryCopy) {
		  queryCopy.name = {
			$regex: queryCopy.keyword,
			$options: 'i',
		  };
		  delete queryCopy.keyword;
		}
	  
		// Advanced Price Filtering
		if ('maxPrice' in queryCopy) {
		  queryCopy.price = { $lte: queryCopy.maxPrice };
		  delete queryCopy.maxPrice;
		}
	  
		if ('minPrice' in queryCopy) {
		  queryCopy.price = { ...queryCopy.price, $gte: queryCopy.minPrice };
		  delete queryCopy.minPrice;
		}
	  
		// Filter by seller
		if ('seller' in queryCopy) {
		  queryCopy.seller = queryCopy.seller;
		}
	  
		console.log(queryCopy);
	  
		// Advanced Rating
		let queryStr = JSON.stringify(queryCopy);
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
	  
		this.query = this.query.find(JSON.parse(queryStr));
		return this;
	  }
	  
  }
  
  module.exports = APIFeatures;
  