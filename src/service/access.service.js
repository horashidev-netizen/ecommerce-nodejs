const shopModel = require("../model/shop.model");
const bcript = require('bcrypt');
const crypto = require('crypto')
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
            const hashedPassword = await bcript.hashSync(password, salt)
            const newShop = await shopModel.create({ name, email, password, roles: RoleShop.SHOP });
            if (newShop) {
                //Create publickey and privatekey with new shop
                const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem',
                        cipher: 'aes-256-cbc',
                        passphrase: 'top secret',
                    },
                },
                (err, publicKey, privateKey) => {

                }
                )
                console.log({publicKey, privateKey}); //Save Collection KeyStore
                
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

module.exports = new AccessService