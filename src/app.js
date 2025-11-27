require('dotenv').config()
const { checkOverLoad } = require('./helpers/check.connect');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');


const app = express();

app.use(helmet());
app.use(morgan('short'));
app.use(compression());

require('./dbs/init.mongodb');
checkOverLoad();

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'you got this page',
        body: "Xin chao bdan nhe".repeat(1000)
    })
})

module.exports = app