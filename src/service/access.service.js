const shopModel = require("../model/shop.model");
const bcript = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { log } = require("console");
const { BadRequestError } = require("../core/error.response");
const salt = 10;

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {

        try {
            const holderShop = await shopModel.findOne({ email }).lean(); //lean tra ve object js thuan tuy
            if (holderShop) {
                throw new BadRequestError('Error: Shop already registered!')
            };
            const hashedPassword = await bcript.hashSync(password, salt);
            const newShop = await shopModel.create({ name, email, password: hashedPassword, roles: RoleShop.SHOP });
            if (newShop) {
                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');

                const tokens = await createTokenPair({ userID: newShop._id, email, roles: RoleShop.SHOP }, publicKey, privateKey);
                console.log(">>> Check token: ", tokens);
                console.log({ publicKey, privateKey }); //Save Collection KeyStore

                const keyStore = await keyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey,
                    privateKey,
                    refreshToken: tokens.refreshToken
                })
                console.log(">>>>>", keyStore)
                if (!keyStore) {
                    throw new BadRequestError('Error: publicKeyString error!')
    
                }

                //Create Token pair

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ["_id", "name", "email"], object: newShop }),
                        tokens
                    }
                }
            }
            return {
                code: 201,
                metadata: {
                    shop: newShop,
                    tokens
                }
            }
        } catch (error) {
            throw new BadRequestError(`Error ${error.message}`)
        }
    }
}

module.exports = AccessService