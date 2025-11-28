'use strict'

const keyModel = require("../model/key.model");

class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await keyModel.create({
                user: userID,
                publicKey: publicKeyString
            }).lean();

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService