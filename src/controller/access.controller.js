'use strict'

const AccessService = require("../service/access.service");
const {CREATED, OK} = require('../core/success.response')
class AccessController {
    logout = async (req, res, next) => {  
        new OK({
            message: "Logout successful",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    login = async (req, res, next) => {
        new OK({
            message: "Login successful",
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signup = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
        }).send(res)
    }
}

module.exports = new AccessController