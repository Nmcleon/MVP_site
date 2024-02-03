const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');

// Set up public file
dotenv.config({ path: 'backend/config/config.env' })


//Connect to DB
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

// Handle Unhandled Promise rejection
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    })
})

