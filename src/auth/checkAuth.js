'use strict'

const { findById } = require("../service/apiKey.service");



const HEADER = {
    API_KEY:'x-api-key',
    AUTHTORIZATION: 'authorization'
};
const apiKey = async (req, res, next) => {
    try{
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key){
            return res.json({
                message: 'Forbidden Error'
            });
        }
        //Check Objkey
        const objKey = await findById(key);
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey;
        return next();
    }
    catch(error){
        console.log(error);
        next(error)
    }
}

const permission = (permission) => {
    return (req, res,next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        console.log('Permission::', req.objKey.permissions);
        const validPermission = req.objKey.permissions.include(permission);
        if(!validPermission){
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        return next()
    }
}
module.exports = {apiKey, permission}