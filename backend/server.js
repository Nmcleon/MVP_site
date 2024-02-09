const app = require('./app')
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary')

const dotenv = require('dotenv');

// Handle Uncaught Exception
process.on("uncaughtException", err => {
    console.log(`ERROR: ${err.stack}`);//stack displays the err in detail, change to message for less detail
    console.log("Uncaught Exception, Server Shutting Down");
    process.exit(1);
})

// Set up public file
dotenv.config({ path: 'backend/config/config.env' })

//Connect to DB
connectDatabase();

//Connect to cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
	api_key : process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

// Handle Unhandled Promise rejection
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);//change message to stack
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    })
})

