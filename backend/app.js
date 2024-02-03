const express = require('express');
const app = express();

const errorMiddleware = require( './middlewares/errors')

app.use(express.json());

//import routes
const products = require('./routes/product');
const auth = require('./routes/auth');

app.use('/api/v1', products);
app.use('/api/v1', auth)

// MIddleware err handler
app.use(errorMiddleware);

module.exports = app;