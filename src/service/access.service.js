const shopModel = require("../model/shop.model");
const bcript = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { log } = require("console");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { OK, CREATED } = require('../core/success.response');
const findByEmail = require("./shop.service");
const KeyTokenService = require("./keyToken.service");

const salt = 10;

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static logout = async (keyStore) => {
        console.log("req.keyStorereq.keyStore", keyStore);
        
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log({delKey});
        return delKey;
    };
    /*
        1 - Check email in dbs
        2 - Match password
        3 - Create AT vs RT and save
        4 - Generate tokens
        5 - Get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        try {
            //1.
            const foundShop = await findByEmail({ email });
            if (!foundShop) throw new BadRequestError(error, 400)
            //2.
            const match = bcript.compare(password, foundShop.password)
            if (!match) throw new AuthFailureError("Tài khoản, mật khẩu không chính xác");
            //3. Created privatedKey, publicKey
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');
            //4. Generate tokens
            const tokens = await createTokenPair({ userID: foundShop._id, email, roles: RoleShop.SHOP }, publicKey, privateKey);
            await KeyTokenService.createKeyToken({
                refreshToken: tokens.refreshToken,
                publicKey, privateKey, userID: foundShop._id
            })
            return {
                shop: getInfoData({ fields: ["_id", "name", "email"], object: foundShop }),
                tokens
            }
        } catch (error) {
            throw new BadRequestError(error)
        }
    };

    static signUp = async ({ name, email, password }) => {
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
            // console.log(">>> Check token: ", tokens);
            // console.log({ publicKey, privateKey }); //Save Collection KeyStore
            const keyStore = await keyTokenService.createKeyToken({
                userID: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            })
            // console.log(">>>>>", keyStore)
            if (!keyStore) {
                throw new BadRequestError('Error: publicKeyString error!')

            }
            //Create Token pair
            return {
                shop: getInfoData({ fields: ["_id", "name", "email"], object: newShop }),
                tokens
            }
        }
    };
}


module.exports = AccessService