/**NO LONGER SUPPORTED IN VERSIONS ABV 6.0
 const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, 
      createIndexes: false, 
    });

    console.log(`MongoDB connected to HOST: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
};*/

const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI).then(() => {
        console.log(`MongoDB connected to HOST: ${mongoose.connection.host}`);
    }).catch(error => {
        console.error(`MongoDB connection error: ${error.message}`);
    });
};

module.exports = connectDatabase;