'use strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/async.handler');
const { AuthFailureError, NotFoundError, ConflictRequestError } = require('../core/error.response');
const { findByUserId } = require('../service/keyToken.service');


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHTORIZATION: 'authorization'
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2d'
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7d'
        });
        await JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('Error verify::', err);
            }
            else {
                console.log('Decode verify::', decode);
            }
        });
        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error creating token pair:', error);
        return null;
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - Check UserID missing?
        2 - Get accessToken
        3 - VerifyToken
        4 - Check user in bds?
        5 - Check keyStore with this userID?
        6 - OK all => Return next()
    */

    //1
    const userID = req.headers[HEADER.CLIENT_ID];
    if (!userID) throw new AuthFailureError('Invalid request');
    //2
 
    const keyStore = await findByUserId(userID);
    if (!keyStore) throw new NotFoundError('Not found keyStore');

    //3
    const accessToken = req.headers[HEADER.AUTHTORIZATION];
    if (!accessToken) throw new NotFoundError('Not Found AccessToken')

    // 4
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userID !== decodeUser.userID) throw new AuthFailureError('Invalid Request decode');
        req.keyStore = keyStore;
        console.log(">>>>>>>>req.keyStore", req.keyStore)
        next();
    } catch (error) {
        throw new ConflictRequestError(error)
    }
})

module.exports = {
    createTokenPair,
    authentication
}