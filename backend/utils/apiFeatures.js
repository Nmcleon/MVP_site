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
	  const removeFields = ['keyword', 'limit', 'page']; // 'Limit' should be 'limit'
	  removeFields.forEach((el) => delete queryCopy[el]);

	  console.log(queryCopy);

	  //advanced Rating
	  let queryStr = JSON.stringify(queryCopy);
	  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
	  
	  console.log(queryStr);
	  this.query = this.query.find(JSON.parse(queryStr)); // Use this.query instead of this.queryStr
	  return this;
	}
  }
  
  module.exports = APIFeatures;
  