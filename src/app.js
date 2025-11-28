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

require('./dbs/init.mongodb');
// checkOverLoad();

app.use('/', require('./routes/index'))
module.exports = app