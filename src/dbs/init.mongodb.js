'use trict'

const mongoose = require('mongoose');
const {countConnect} = require('../helpers/check.connect');
const {db} = require("../config/config.mongodb");

const mongoURL = `mongodb://${db.host}:${db.port}/${db.name}`;

class Database {
    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {
        console.log(mongoURL);
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(mongoURL, {maxPoolSize: 50}).then(_ => {
            countConnect();
            console.log('Connected Mongodb Success: ',mongoURL);
        }).catch((error) => {
            console.log(">>> Connect error", error);
        })
    }
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance()

module.exports = instanceMongoDB