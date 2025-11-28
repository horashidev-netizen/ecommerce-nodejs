'use strict'

const AccessService = require("../service/access.service");

class AccessController {
    signup = async (req, res, next) => {
        try {
            console.log("[P]::signUp::", req.body);
            const shopInfo = req.body;
            const { name, email, password } = shopInfo
            return res.status(200).json(await AccessService.signUp({ name, email, password }))
        } catch (error) {
            console.log("An error occured", error)
            next(error);
        }
    }
}

module.exports = new AccessController