const process = require("process");
require('dotenv').config();

const dev = {
    appInfo: {
        port: process.env.DEV_APP_PORT
    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME
    }
};
const prod = {
    appInfo: {
        port: process.env.PRODUCT_APP_PORT
    },
    db: {
        host: process.env.PRODUCT_DB_HOST,
        port: process.env.PRODUCT_DB_PORT,
        name: process.env.PRODUCT_DB_NAME
    }
};

const environment = process.env.NODE_ENV || 'dev';
const config = {dev, prod};

module.exports = config[environment];