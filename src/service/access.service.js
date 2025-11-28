const shopModel = require("../model/shop.model");
const bcript = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
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
                return {
                    code: 'xxxx',
                    message: 'Shop already registed'
                }
            };
            const hashedPassword = await bcript.hashSync(password, salt);
            const newShop = await shopModel.create({ name, email, password: hashedPassword, roles: RoleShop.SHOP });
            console.log(newShop);
            if (newShop) {
                //Create publickey and privatekey with new shop
                const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1', // Thường dùng pkcs1 cho RSA public key
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                },
                )
                console.log({ publicKey, privateKey }); //Save Collection KeyStore
                const publicKeyString = await keyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey
                })
                if (!publicKeyString) {
                    return {
                        code: 'xxxx',
                        message: 'publicKeyString error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey( publicKey )
                
                //Create Token pair
                const tokens = await createTokenPair({ userID: newShop._id, email, roles: RoleShop.SHOP }, publicKeyObject, privateKey);
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ["_id", "name", "email"], object: newShop}),
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
            return {
                code: "xxx",
                message: error.message,
                status: 'error'
            };
        }
    }
}

module.exports = AccessService