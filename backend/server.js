const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');

// Set up public file
dotenv.config({ path: 'backend/config/config.env' })


//Connect to DB
connectDatabase();

app.listen(process.env.PORT, () => {
	console.log(`Server running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)

})