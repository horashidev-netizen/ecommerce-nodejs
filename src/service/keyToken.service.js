'use strict'

const { Types } = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const keyModel = require("../model/key.model");

class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey, privateKey, refreshToken}) => {
        // console.log(">>>>>>>", privateKey, publicKey);
        
        try {
            //  Level 0
            // const tokens = await keyModel.create({
            //     user: userID,
            //     publicKey,
            //     privateKey,
            //     refreshToken
            // });

            //  Level xxx
            const filter = { user: userID}, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keyModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw new BadRequestError(error,'400')
        }
    }

    static findByUserId = async (userId) => {
        // console.log(">>>>>>>>", userId)
        return await keyModel.findOne({user: new Types.ObjectId(userId)}).lean();
    }

    static removeKeyById = async (userId) => {
        console.log(">>>>>>>>", userId)
        return await keyModel.deleteOne({user: new Types.ObjectId(userId)}).lean();
    }
}

module.exports = KeyTokenService