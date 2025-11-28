'use strict'

const keyModel = require("../model/key.model");

class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey, privateKey, refreshToken = '' }) => {
        console.log(">>>>>>>", privateKey, publicKey);
        
        try {
            const tokens = await keyModel.create({
                user: userID,
                publicKey,
                privateKey,
                refreshToken
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService