require('dotenv').config()
const { checkOverLoad } = require('./helpers/check.connect');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('short'));
app.use(compression());

// init db
require('./dbs/init.mongodb');
// checkOverLoad();

// init route
app.use('/', require('./routes/index'));

// Handling error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.statusCode = 404;
    next(error);
});
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
});
module.exports = app