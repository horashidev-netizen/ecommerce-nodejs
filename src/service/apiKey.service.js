'use strict'
const crypto = require('crypto')
const apiKeyModel = require("../model/apiKey.model")

const findById = async (key) => {
    // const newKey = await apiKeyModel.create({key: crypto.randomBytes(64).toString('hex'), permissions: ['0000']})
    // const {key, status, permissions} = newKey
    // console.log("Check New Key :: ", newKey, {keys, status: true});
    // const objKey = await apiKeyModel.findOne({key, status: true}).lean();
    
    const objKey = await apiKeyModel.findOne({key, status: true}).lean();
    return objKey
}

module.exports = {findById}